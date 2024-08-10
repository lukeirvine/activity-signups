import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useFormHooks from "./use-form-hooks";

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
      try {
        const callbackUrl = searchParams?.get("callbackUrl") || undefined;
        
      } catch (error) {
        formHooks.setFormState((state) => ({
          ...state,
          submitError: ["Error logging in. Please try again."],
        }));
        return false;
      }
    },
  });

  return {
    ...formHooks,
    requiresSecondFactor,
  };
};

export default useLoginForm;
