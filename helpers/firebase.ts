import { fireStore } from "@/utils/Fire";
import { doc, setDoc as firebaseSetDoc, updateDoc as firebaseUpdateDoc } from "firebase/firestore";
import uuid from "react-uuid";

type FirebaseWriteResponse = {
  success: boolean;
  error?: string;
}

type FirebaseWriteParams = {
  collectionId: string;
  docId?: string;
  data: any;
};

export const setDoc = async ({
  collectionId,
  docId,
  data,
}: FirebaseWriteParams): Promise<FirebaseWriteResponse> => {
  try {
    await firebaseSetDoc(doc(fireStore, collectionId, docId || uuid()), data);
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: "An error occurred" };
  }
}

export const updateDoc = async ({
  collectionId,
  docId,
  data,
}: FirebaseWriteParams): Promise<FirebaseWriteResponse> => {
  try {
    await firebaseUpdateDoc(doc(fireStore, collectionId, docId || uuid()), data);
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error: "An error occurred" };
  }
}