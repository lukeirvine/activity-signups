import {onCall} from "firebase-functions/v2/https";
import {firestore} from "firebase-admin";
import {verifyPermissions, setDoc, throwError} from "./utils";

const db = firestore();

/**
 * Clone one document (and all of its subcollections) from `src` into `destCollection`.
 * Preserves the child‐document IDs exactly.
 */
async function cloneDocumentRecursive(
  src: FirebaseFirestore.DocumentReference,
  destCollection: FirebaseFirestore.CollectionReference,
  depth = 0
): Promise<FirebaseFirestore.DocumentReference> {
  console.log( `clone level=${depth} src=${src.path} dest=${destCollection.path}` );
  // 1) Read source data
  const snap = await src.get();
  if (!snap.exists) {
    throw new Error(`Source ${src.path} does not exist.`);
  }
  const data = snap.data();

  // 2) Create a new document in the destination collection
  const newDoc = await setDoc({
    collectionPath: destCollection.path,
    data,
  });

  // 3) Recurse into each subcollection
  const subcols = await src.listCollections();
  console.log("subcol length:", subcols.length);
  for (const subcol of subcols) {
    // “childDest” is the matching subcollection under our new doc
    const childDest = newDoc.collection(subcol.id);
    const childDocs = await subcol.listDocuments();
    for (const child of childDocs) {
      // NOTE: passing real references, not strings
      await cloneDocumentRecursive(child, childDest, depth + 1);
    }
  }

  return newDoc;
}

/**
 * Callable function that deep-duplicates a doc + its subcollections.
 * Expects:
 *   { collectionId, docId, destCollectionId, destDocId }
 */
export const deepDuplicate = onCall(async (request) => {
  const {sourceDocPath, destCollectionPath} = request.data ?? {};

  await verifyPermissions(request);

  // --- validate input ---
  if (
    ![sourceDocPath, destCollectionPath].every(
      (p) => typeof p === "string" && p.length > 0
    )
  ) {
    throwError(
      "invalid-argument",
      "collectionId, docId, destCollectionId, and destDocId must all be non-empty strings."
    );
  }

  const sourceRef = db.doc(sourceDocPath);
  const destCollection = db.collection(destCollectionPath);

  const newDocRef = await cloneDocumentRecursive(sourceRef, destCollection);

  return {
    success: true,
    message: `Copied ${sourceRef.path} → ${newDocRef.path}`,
  };
});

export const deepDuplicateDay = onCall(async (request) => {
  const {weekId, dayId, destWeekId, destDate} = request.data ?? {};

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

  const sourceRef = db.doc(`weeks/${weekId}/days/${dayId}`);
  const destCollection = db.collection(`weeks/${destWeekId}/days`);

  const newDayRef = await cloneDocumentRecursive(sourceRef, destCollection);

  await newDayRef.update({date: destDate, weekId: destWeekId});

  return {
    success: true,
    newDayId: newDayRef.id,
    message: `Copied ${sourceRef.path} → ${newDayRef.path}`,
  };
});
