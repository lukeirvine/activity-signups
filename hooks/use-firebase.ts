import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireStore } from "@/utils/Fire";

type FirebaseRequestParams = {
  collectionId: string;
  docId: string;
};

export const useReadDoc = ({
  collectionId,
  docId,
}: FirebaseRequestParams) => {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docRef = doc(fireStore, collectionId, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setDoc(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        setDoc(undefined);
      }
      setLoading(false);
    })();
  }, [collectionId, docId]);

  return { doc, loading };
}