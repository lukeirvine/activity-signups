import { collection, getDoc, getDocs, onSnapshot, query, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireStore } from "@/utils/Fire";

type FirebaseCollectionRequestParams = {
  collectionId: string;
};

interface FirebaseDocRequestParams extends FirebaseCollectionRequestParams {
  docId: string;
};

export const useReadDoc = ({
  collectionId,
  docId,
}: FirebaseDocRequestParams) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docRef = doc(fireStore, collectionId, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(undefined);
      }
      setLoading(false);
    })();
  }, [collectionId, docId]);

  return { data, loading };
}

export const useListenDoc = ({
  collectionId,
  docId,
}: FirebaseDocRequestParams) => {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(fireStore, collectionId, docId), (doc: any) => {
      if (doc.exists()) {
        setDoc(doc.data());
      } else {
        setDoc(undefined);
      }
      setLoading(false);
    });

    return () => {
      unsub();
    }
  }, [collectionId, docId]);

  return { doc, loading };
};

export const useReadCollection = ({
  collectionId,
}: FirebaseCollectionRequestParams) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(fireStore, collectionId));
      const data: any = {}
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        data[doc.id] = doc.data();
      });
      setDocs(data);
      setLoading(false);
    })();
  }, [collectionId]);

  return { docs, loading };
}

export const useListenCollection = ({
  collectionId,
}: FirebaseCollectionRequestParams) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(fireStore, collectionId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: any = {};
      querySnapshot.forEach((doc) => {
        docs[doc.id] = doc.data();
      });
      setDocs(docs);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    }
  }, [collectionId]);

  return { docs, loading };
}
