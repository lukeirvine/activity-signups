import * as functions from "firebase-functions";
// import {FunctionsErrorCode} from "firebase-functions/v1/https";
import {firestore} from "firebase-admin";
import {CallableRequest, FunctionsErrorCode} from "firebase-functions/v2/https";
const { v4: uuidv4 } = require('uuid');

const db = firestore();

export const throwError = (code: FunctionsErrorCode, message: string) => {
  throw new functions.https.HttpsError(code, message);
};

export const verifyPermissions = async (request: CallableRequest) => {
  if (!request.auth?.uid) {
    throwError("permission-denied", "Unauthorized");
  }
};

export const deleteCollectionRecursive = async (
  collectionRef: firestore.CollectionReference, batchSize: number
): Promise<void> => {
  const query = collectionRef.limit(batchSize);

  return query.get().then(async (snapshot) => {
    if (snapshot.size === 0) {
      return;
    }

    const batch = db.batch();
    for (const doc of snapshot.docs) {
      const subCollections = await doc.ref.listCollections();
      for (const subCollection of subCollections) {
        await deleteCollectionRecursive(subCollection, batchSize);
      }
      batch.delete(doc.ref);
    }

    await batch.commit();

    if (snapshot.size >= batchSize) {
      // Recursively delete remaining documents
      return deleteCollectionRecursive(collectionRef, batchSize);
    }
  });
};

export async function getDoc<T extends firestore.DocumentData>({
  collectionId,
  docId,
}: { collectionId: string; docId: string }): Promise<T | undefined> {
  const docRef = db.collection(collectionId).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return undefined;
  }
  return doc.data() as T;
}

export async function getAllDocs<T extends firestore.DocumentData>(
  collectionId: string
): Promise<{ [id: string]: T }> {
  const querySnapshot = await db.collection(collectionId).get();
  const data: { [id: string]: T } = {};
  querySnapshot.forEach((doc) => {
    data[doc.id] = doc.data() as T;
  });
  return data;
}

type FirebaseSetParams<T> = {
  collectionPath: string;
  docId?: string;
  data: T;
};

type FirebaseUpdateParams<T> = {
  collectionPath: string;
  docId: string;
  data: Partial<T>;
};

export async function updateDoc<T extends firestore.DocumentData>({
  collectionPath,
  docId,
  data,
}: FirebaseUpdateParams<T>): Promise<void> {
  try {
    await db.collection(collectionPath).doc(docId).update({
      ...data,
      timeUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throwError("internal", "Error updating document");
  }
}


/**
 * Exactly like the client’s setDoc(..., { merge: true }),
 * but using the Admin SDK.
 */
export async function setDoc<T extends firestore.DocumentData>({
  collectionPath,
  docId,
  data
}: FirebaseSetParams<T>): Promise<FirebaseFirestore.DocumentReference> {
  const newId = docId || uuidv4();
  try {
    const ref = db.collection(collectionPath).doc(newId);
    await ref.set({
      ...data,
      id: newId,
      timeCreated: new Date().toISOString(),
      timeUpdated: new Date().toISOString(),
    }, { merge: true });
    return ref;
  } catch (error) {
    console.error("Error setting document:", error);
    throwError("internal", "Error setting document");
    return Promise.reject(error);
  }
}
