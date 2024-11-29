"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import ActionVerificationModal, {
  ActionVerificationDefaultProps,
  ActionVerificationModalProps,
} from "@/components/molecules/alerts/action-verification-modal/action-verification-modal";
import useActionActionVerificationModal from "@/hooks/use-action-verification-modal";

type ActionVerificationModalContextType = {
  actionVerification: ActionVerificationModalProps;
  setActionVerification: Dispatch<SetStateAction<ActionVerificationModalProps>>;
  updateButtonLoading: (loading: boolean, index: number) => void;
  closeActionVerification: () => void;
};

const actionActionVerificationModalContextDefaultValues: ActionVerificationModalContextType =
  {
    actionVerification: ActionVerificationDefaultProps,
    setActionVerification: () => {},
    updateButtonLoading: () => {},
    closeActionVerification: () => {},
  };

const ActionVerificationModalContext = createContext(
  actionActionVerificationModalContextDefaultValues,
);

export function useActionVerificationModalContext() {
  return useContext(ActionVerificationModalContext);
}

type ActionVerificationModalProviderProps = {
  children: ReactNode;
  onClose?: () => void;
};

export const ActionVerificationModalProvider: React.FC<
  Readonly<ActionVerificationModalProviderProps>
> = ({ children, onClose }) => {
  const {
    actionVerification,
    setActionVerification,
    updateButtonLoading,
    closeActionVerification,
  } = useActionActionVerificationModal();

  const handleClose = () => {
    closeActionVerification();
    onClose?.();
    actionVerification?.onClose();
  };

  return (
    <ActionVerificationModalContext.Provider
      value={{
        actionVerification,
        setActionVerification,
        updateButtonLoading,
        closeActionVerification,
      }}
    >
      {children}
      <ActionVerificationModal
        title={actionVerification?.title || ""}
        message={actionVerification?.message}
        buttons={actionVerification?.buttons}
        isOpen={actionVerification?.isOpen}
        onClose={handleClose}
      />
    </ActionVerificationModalContext.Provider>
  );
};
