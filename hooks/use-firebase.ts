import { collection, getDoc, getDocs, onSnapshot, query, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireStore } from "@/utils/Fire";

type FirebaseCollectionRequestParams = {
  collectionId: string;
};

interface FirebaseDocRequestParams extends FirebaseCollectionRequestParams {
  docId: string;
};

interface FirebaseDocReturn<T> {
  data: T | null | undefined;
  loading: boolean;
}

interface FirebaseCollection<T> {
  [key: string]: T;
}

interface FirebaseCollectionReturn<T> {
  docs: FirebaseCollection<T> | null | undefined;
  loading: boolean;
}

export function useReadDoc<T>({
  collectionId,
  docId,
}: FirebaseDocRequestParams): FirebaseDocReturn<T> {
  const [data, setData] = useState<T | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docRef = doc(fireStore, collectionId, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data() as T);
      } else {
        setData(undefined);
      }
      setLoading(false);
    })();
  }, [collectionId, docId]);

  return { data, loading };
}

export function useListenDoc<T>({
  collectionId,
  docId,
}: FirebaseDocRequestParams): FirebaseDocReturn<T> {
  const [data, setData] = useState<T | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(fireStore, collectionId, docId), (doc: any) => {
      if (doc.exists()) {
        setData(doc.data() as T);
      } else {
        setData(undefined);
      }
      setLoading(false);
    });

    return () => {
      unsub();
    }
  }, [collectionId, docId]);

  return { data, loading };
};

export function useReadCollection<T>({
  collectionId,
}: FirebaseCollectionRequestParams): FirebaseCollectionReturn<T> {
  const [docs, setDocs] = useState<FirebaseCollection<T> | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(fireStore, collectionId));
      const data: FirebaseCollection<T> = {};
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        data[doc.id] = doc.data() as T;
      });
      if (Object.keys(data).length === 0) {
        setDocs(undefined);
      } else {
        setDocs(data);
      }
      setLoading(false);
    })();
  }, [collectionId]);

  return { docs, loading };
}

export function useListenCollection<T>({
  collectionId,
}: FirebaseCollectionRequestParams): FirebaseCollectionReturn<T> {
  const [docs, setDocs] = useState<FirebaseCollection<T> | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(fireStore, collectionId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: FirebaseCollection<T> = {};
      querySnapshot.forEach((doc) => {
        docs[doc.id] = doc.data() as T;
      });
      if (Object.keys(docs).length === 0) {
        setDocs(undefined);
      } else {
        setDocs(docs);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    }
  }, [collectionId]);

  return { docs, loading };
}
