import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { fireAuth } from "@/utils/Fire";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return user;
}
