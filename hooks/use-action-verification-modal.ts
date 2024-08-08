import { useState } from "react";
import {
  ActionVerificationDefaultProps,
  ActionVerificationModalProps,
} from "@/components/molecules/alerts/action-verification-modal/action-verification-modal";

const useActionVerificationModal = () => {
  const [actionVerification, setActionVerification] =
    useState<ActionVerificationModalProps>(ActionVerificationDefaultProps);

  const updateButtonLoading = (loading: boolean, index: number) => {
    setActionVerification((prevState) => {
      // Check if buttons exist and the index is within range
      if (
        !prevState.buttons ||
        index < 0 ||
        index >= prevState.buttons.length
      ) {
        return prevState; // Return current state if no buttons or invalid index
      }

      // Update the specified button with the new loading state
      const updatedButtons = prevState.buttons.map((button, i) => {
        if (i === index) {
          return { ...button, loading: loading };
        }
        return button;
      });

      // Return the updated state
      return {
        ...prevState,
        buttons: updatedButtons,
      };
    });
  };

  const closeActionVerification = () =>
    setActionVerification((prev) => ({ ...prev, isOpen: false }));

  return {
    actionVerification,
    setActionVerification,
    updateButtonLoading,
    closeActionVerification,
  };
};

export default useActionVerificationModal;
