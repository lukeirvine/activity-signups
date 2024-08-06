import { fireStore } from "@/utils/Fire";
import { doc, setDoc as firebaseSetDoc, updateDoc as firebaseUpdateDoc } from "firebase/firestore";
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