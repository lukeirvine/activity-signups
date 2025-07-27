import { logger } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';
import { firestore } from 'firebase-admin';
import { updateDoc, verifyPermissions } from './utils';
import { setDoc, throwError } from './utils';

const db = firestore();

type DocumentIds = {
  collection: string;
  doc: string
}

/**
 * Recursively duplicates a Firestore document and all of its subcollections.
 *
 * @param sourceDocRef Reference to the document you want to copy.
 * @param destDocRef   Reference where the copy should be written.
 */
export async function deepDuplicateDocumentRecursive(
  sourceDocIds: DocumentIds,
  destCollectionId: string,
): Promise<void> {
  const sourceDocRef = db.collection(sourceDocIds.collection).doc(sourceDocIds.doc);
  const snap = await sourceDocRef.get();
  if (!snap.exists || !snap.data()) {
    throw new Error(`Source document at ${sourceDocRef.path} does not exist.`);
  }

  await setDoc({
    collectionId: destCollectionId,
    data: snap.data() || {},
  });

  // 2. Recurse into each subcollection
  const subcols = await sourceDocRef.listCollections();
  for (const subcol of subcols) {
    const childDocs = await subcol.listDocuments();
    for (const childSrcRef of childDocs) {
      const childSrcIds = {
        collection: subcol.id,
        doc: childSrcRef.id,
      };
      await deepDuplicateDocumentRecursive(childSrcIds, subcol.id);
    }
  }
}

export async function deepDuplicateDocument({
  collectionId,
  docId,
  destCollectionId,
}: {
  collectionId: string;
  docId: string;
  destCollectionId: string;
}): Promise<{ success: boolean; message?: string, destRef?: FirebaseFirestore.DocumentReference }> {

  const sourceRef = db.collection(collectionId).doc(docId);

  try {
    await deepDuplicateDocumentRecursive(
      { collection: collectionId, doc: docId },
      destCollectionId
    );
    return {
      success: true,
      message: `Copied ${sourceRef.path} → ${destCollectionId}`,
      destRef: db.collection(destCollectionId).doc(docId),
    };
  } catch (err: any) {
    logger.error('deepDuplicate failed', err);
    throwError('internal', err.message);
  }
  return { success: false, message: 'Failed to duplicate document' };
}

/**
 * Callable function that deep-duplicates a doc + its subcollections.
 * Expects:
 *   { collectionId, docId, destCollectionId, destDocId }
 */
export const deepDuplicate = onCall(async (request) => {
  const { collectionId, docId, destCollectionId } = request.data ?? {};

  await verifyPermissions(request);

  // --- validate input ---
  if (
    ![collectionId, docId, destCollectionId].every(
      (p) => typeof p === 'string' && p.length > 0
    )
  ) {
    throwError(
      'invalid-argument',
      'collectionId, docId, destCollectionId, and destDocId must all be non-empty strings.'
    );
  }

  return await deepDuplicateDocument({
    collectionId,
    docId,
    destCollectionId
  });
});

export const deepDuplicateDay = onCall(async (request) => {
  const { weekId, dayId, destWeekId, destDate } = request.data ?? {};

  await verifyPermissions(request);

  // --- validate input ---
  if (
    ![weekId, dayId, destWeekId].every(
      (p) => typeof p === 'string' && p.length > 0
    )
  ) {
    throwError(
      'invalid-argument',
      'weekId, dayId, and destWeekId must all be non-empty strings.'
    );
  }

  const result = await deepDuplicateDocument({
    collectionId: `weeks/${weekId}/days`,
    docId: dayId,
    destCollectionId: `weeks/${destWeekId}/days`,
  });

  if (result.success && result.destRef) {
    await updateDoc({
      collectionId: `weeks/${destWeekId}/days`,
      docId: result.destRef.id,
      data: {
        date: destDate,
        weekId: destWeekId,
      },
    })
  }
})