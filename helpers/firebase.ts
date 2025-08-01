import {
  doc,
  setDoc as firebaseSetDoc,
  updateDoc as firebaseUpdateDoc,
  writeBatch,
  deleteDoc as firebaseDeleteDoc,
  getDocs,
  collection,
  WriteBatch,
  DocumentReference,
  DocumentData,
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

type FirebaseSetBatchBaseParams = {
  as: "collection" | "doc";
  batch?: WriteBatch;
};

interface FirebaseSetBatchDoc extends FirebaseSetBatchBaseParams {
  as: "doc";
  ref: DocumentReference<DocumentData>;
  data: any;
  subcols?: FirebaseSetBatchCollection[];
}

interface FirebaseSetBatchCollection extends FirebaseSetBatchBaseParams {
  as: "collection";
  children: FirebaseSetBatchDoc[];
}

type FirebaseSetBatchCombinedParams =
  | FirebaseSetBatchDoc
  | FirebaseSetBatchCollection;

function setBatchRecursive({
  as,
  batch: incomingBatch,
  ...props
}: FirebaseSetBatchCombinedParams): WriteBatch {
  const data = as === "doc" ? (props as FirebaseSetBatchDoc).data : undefined;
  const children =
    as === "collection"
      ? (props as FirebaseSetBatchCollection).children
      : undefined;
  const batch = incomingBatch ?? writeBatch(fireStore);

  if (as === "doc") {
    const ref = (props as FirebaseSetBatchDoc).ref;
    const subcols = (props as FirebaseSetBatchDoc).subcols;
    batch.set(ref, {
      ...data,
      timeCreated: new Date().toISOString(),
      timeUpdated: new Date().toISOString(),
    });
    if (subcols) {
      console.log("These are the subcols", subcols);
      subcols.forEach((subcol) => {
        console.log("Setting subcollection", subcol);
        setBatchRecursive(subcol);
      });
    }
  } else if (as === "collection" && children) {
    children.forEach((child) => {
      console.log("Setting child document", child);
      setBatchRecursive(child);
    });
  }

  return batch;
}

export async function setBatch({
  as,
  batch,
  ...props
}: FirebaseSetBatchCombinedParams): Promise<FirebaseWriteResponse> {
  if (as === "doc") {
    const ref = (props as FirebaseSetBatchDoc).ref;
    batch = setBatchRecursive({
      as: "doc",
      ref,
      batch,
      data: (props as FirebaseSetBatchDoc).data,
      subcols: (props as FirebaseSetBatchDoc).subcols,
    });
  } else {
    batch = setBatchRecursive({
      as: "collection",
      batch,
      children: (props as FirebaseSetBatchCollection).children,
    });
  }

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
