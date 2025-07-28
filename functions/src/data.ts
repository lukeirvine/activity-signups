import { logger } from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import { firestore } from "firebase-admin";
import { updateDoc, verifyPermissions } from "./utils";
import { setDoc, throwError } from "./utils";

const db = firestore();

type DocumentIdsd = {
  collection: string;
  doc: string;
};

/**
 * Recursively duplicates a Firestore document and all of its subcollections.
 *
 * @param sourceDocRef Reference to the document you want to copy.
 * @param destDocRef   Reference where the copy should be written.
 */
export async function deepDuplicateDocumentRecursive({
  sourceCollectionPath,
  sourceDocId,
  destCollectionPath,
}: {
  sourceCollectionPath: string;
  sourceDocId: string;
  destCollectionPath: string;
}): Promise<FirebaseFirestore.DocumentReference | void> {
  const sourceDocRef = db.collection(sourceCollectionPath).doc(sourceDocId);
  const snap = await sourceDocRef.get();
  if (!snap.exists || !snap.data()) {
    throw new Error(`Source document at ${sourceDocRef.path} does not exist.`);
  }

  const newRef = await setDoc({
    collectionPath: destCollectionPath,
    data: snap.data() || {},
  });

  // 2. Recurse into each subcollection
  const subcols = await sourceDocRef.listCollections();
  if (subcols.length > 0) {
    for (const subcol of subcols) {
      const childDocs = await subcol.listDocuments();
      for (const childSrcRef of childDocs) {
        await deepDuplicateDocumentRecursive({
          sourceCollectionPath: subcol.path,
          sourceDocId: childSrcRef.id,
          destCollectionPath: `${newRef.path}/${subcol.id}`,
        });
      }
    }
  } else {
    return newRef;
  }
}

export async function deepDuplicateDocument({
  collectionPath,
  docId,
  destCollectionPath,
}: {
  collectionPath: string;
  docId: string;
  destCollectionPath: string;
}): Promise<{
  success: boolean;
  message?: string;
  destRef?: FirebaseFirestore.DocumentReference;
}> {
  const sourceRef = db.collection(collectionPath).doc(docId);

  try {
    const destRef =
      (await deepDuplicateDocumentRecursive({
        sourceCollectionPath: collectionPath,
        sourceDocId: docId,
        destCollectionPath,
      })) ?? undefined;
    return {
      success: true,
      message: `Copied ${sourceRef.path} → ${destCollectionPath}`,
      destRef,
    };
  } catch (err: any) {
    logger.error("deepDuplicate failed", err);
    throwError("internal", err.message);
  }
  return { success: false, message: "Failed to duplicate document" };
}

/**
 * Callable function that deep-duplicates a doc + its subcollections.
 * Expects:
 *   { collectionId, docId, destCollectionId, destDocId }
 */
export const deepDuplicate = onCall(async (request) => {
  const { collectionPath, docId, destCollectionPath } = request.data ?? {};

  await verifyPermissions(request);

  // --- validate input ---
  if (
    ![collectionPath, docId, destCollectionPath].every(
      (p) => typeof p === "string" && p.length > 0
    )
  ) {
    throwError(
      "invalid-argument",
      "collectionId, docId, destCollectionId, and destDocId must all be non-empty strings."
    );
  }

  return await deepDuplicateDocument({
    collectionPath,
    docId,
    destCollectionPath,
  });
});

export const deepDuplicateDay = onCall(async (request) => {
  const { weekId, dayId, destWeekId, destDate } = request.data ?? {};

  await verifyPermissions(request);

  // --- validate input ---
  if (
    ![weekId, dayId, destWeekId].every(
      (p) => typeof p === "string" && p.length > 0
    )
  ) {
    throwError(
      "invalid-argument",
      "weekId, dayId, and destWeekId must all be non-empty strings."
    );
  }

  const result = await deepDuplicateDocument({
    collectionPath: `weeks/${weekId}/days`,
    docId: dayId,
    destCollectionPath: `weeks/${destWeekId}/days`,
  });

  if (result.success && result.destRef) {
    await updateDoc({
      collectionPath: `weeks/${destWeekId}/days`,
      docId: result.destRef.id,
      data: {
        date: destDate,
        weekId: destWeekId,
      },
    });
  }
});
