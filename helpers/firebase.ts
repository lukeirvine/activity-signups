import {
  doc,
  setDoc as firebaseSetDoc,
  updateDoc as firebaseUpdateDoc,
  writeBatch,
  deleteDoc as firebaseDeleteDoc,
  getDocs,
  collection,
  WriteBatch,
} from "firebase/firestore";
import uuid from "react-uuid";
import { fireStore } from "@/utils/Fire";

export type FirebaseWriteResponse = {
  success: boolean;
  error?: string;
  uid?: string;
};

type FirebaseSetParams<T> = {
  collectionId: string;
  docId?: string;
  data: T;
};

type FirebaseUpdateParams<T> = {
  collectionId: string;
  docId: string;
  data: Partial<T>;
};

interface FirebaseSetBatchDoc {
  collectionPath: string;
  docId?: string;
  data: any;
  batch?: WriteBatch;
}

type FirebaseSetBatchParams = {
  batch?: WriteBatch;
  docs: FirebaseSetBatchDoc[];
};

export async function setBatch({
  batch: incomingBatch,
  docs,
}: FirebaseSetBatchParams): Promise<FirebaseWriteResponse> {
  const batch = incomingBatch ?? writeBatch(fireStore);

  docs.forEach(({ collectionPath, docId, data }) => {
    const newId = docId ?? uuid();
    batch.set(doc(fireStore, collectionPath, newId), {
      ...data,
      id: newId,
      timeCreated: new Date().toISOString(),
      timeUpdated: new Date().toISOString(),
    });
  });

  try {
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error committing batch: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function setDoc<T>({
  collectionId,
  docId,
  data,
}: FirebaseSetParams<T>): Promise<FirebaseWriteResponse> {
  const newId = docId || uuid();
  try {
    await firebaseSetDoc(doc(fireStore, collectionId, newId), {
      ...data,
      id: newId,
      timeCreated: new Date().toISOString(),
      timeUpdated: new Date().toISOString(),
    });
    return { success: true, uid: newId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function updateDoc<T>({
  collectionId,
  docId,
  data,
}: FirebaseUpdateParams<T>): Promise<FirebaseWriteResponse> {
  try {
    await firebaseUpdateDoc(doc(fireStore, collectionId, docId), {
      ...data,
      timeUpdated: new Date().toISOString(),
    } as Partial<T>);
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function setCollection<T>({
  collectionId,
  data,
}: {
  collectionId: string;
  data: T[];
}): Promise<FirebaseWriteResponse> {
  try {
    const batch = writeBatch(fireStore);
    data.forEach((item) => {
      const newId = uuid();
      const docRef = doc(fireStore, collectionId, newId);
      batch.set(docRef, {
        ...item,
        id: newId,
        timeCreated: new Date().toISOString(),
        timeUpdated: new Date().toISOString(),
      });
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error adding documents: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function getCollection<T>({
  collectionId,
}: {
  collectionId: string;
}): Promise<{ [key: string]: T } | undefined> {
  try {
    const querySnapshot = await getDocs(collection(fireStore, collectionId));
    const data: { [key: string]: T } = {};
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      data[doc.id] = doc.data() as T;
    });
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return undefined;
  }
}

export async function deleteDoc({
  collectionId,
  docId,
}: {
  collectionId: string;
  docId: string;
}): Promise<FirebaseWriteResponse> {
  try {
    await firebaseDeleteDoc(doc(fireStore, collectionId, docId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function deleteCollection<T>({
  collectionId,
}: {
  collectionId: string;
}): Promise<FirebaseWriteResponse> {
  try {
    const docs = await getCollection<T>({ collectionId });
    if (docs) {
      const batch = writeBatch(fireStore);
      Object.keys(docs).forEach((docId) => {
        const docRef = doc(fireStore, collectionId, docId);
        batch.delete(docRef);
      });
      await batch.commit();
      return { success: true };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error("Error deleting documents: ", error);
    return { success: false, error: "An error occurred" };
  }
}
