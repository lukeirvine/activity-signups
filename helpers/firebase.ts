import { fireStore } from "@/utils/Fire";
import { doc, setDoc as firebaseSetDoc, updateDoc as firebaseUpdateDoc, writeBatch, deleteDoc as firebaseDeleteDoc, getDocs, collection } from "firebase/firestore";
import uuid from "react-uuid";

type FirebaseWriteResponse = {
  success: boolean;
  error?: string;
}

type FirebaseSetParams<T> = {
  collectionId: string;
  docId?: string;
  data: T;
};

type FirebaseUpdateParams<T> = {
  collectionId: string;
  docId: string;
  data: T;
};

export async function setDoc<T>({
  collectionId,
  docId,
  data,
}: FirebaseSetParams<T>): Promise<FirebaseWriteResponse> {
  try {
    const newId = uuid();
    await firebaseSetDoc(doc(fireStore, collectionId, docId || newId), {...data, id: newId});
    return { success: true };
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
    await firebaseUpdateDoc(doc(fireStore, collectionId, docId), data as Partial<T>);
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function setCollection<T>({
  collectionId,
  data,
}: { collectionId: string; data: T[] }): Promise<FirebaseWriteResponse> {
  try {
    const batch = writeBatch(fireStore);
    data.forEach((item) => {
      const newId = uuid();
      const docRef = doc(fireStore, collectionId, newId);
      batch.set(docRef, {...item, id: newId});
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
}: { collectionId: string }): Promise<{ [key: string]: T } | undefined> {
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
}: { collectionId: string; docId: string }): Promise<FirebaseWriteResponse> {
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
}: { collectionId: string }): Promise<FirebaseWriteResponse> {
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