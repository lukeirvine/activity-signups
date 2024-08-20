import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useFormHooks from "./use-form-hooks";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "@/utils/Fire";

interface LoginFormData {
  username: string;
  password: string;
  stay_signed_in: boolean;
}

const useLoginForm = () => {
  const requiredFields: (keyof LoginFormData)[] = useMemo(() => {
    return ["username", "password"];
  }, []);
  const formData = {
    username: "",
    password: "",
    stay_signed_in: false,
  };
  const [requiresSecondFactor, setRequiresSecondFactor] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const formHooks = useFormHooks({
    requiredFields,
    initialize: () => formData,
    onSubmit: async () => {
      const callbackUrl = searchParams?.get("callbackUrl") || undefined;
      signInWithEmailAndPassword(fireAuth, formHooks.values.username, formHooks.values.password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          router.push(callbackUrl || "/");
        })
        .catch((error) => {
          formHooks.setFormState((state) => ({
          ...state,
          submitError: [
            error.message || "Error logging in. Please try again.",
          ],
          isSubmitting: false,
        }));
      });
    },
  });

  return {
    ...formHooks,
    requiresSecondFactor,
  };
};

export default useLoginForm;
