import React, { ReactNode } from "react";
import ModalConfirmationMessage, {
  ButtonProps,
} from "../modal-confirmation-message/modal-confirmation-message";
import Modal from "@/components/atoms/modal/modal";

export type ActionVerification = {
  title: string;
  message?: string | ReactNode;
  buttons?: ButtonProps[];
};

export interface ActionVerificationModalProps extends ActionVerification {
  isOpen: boolean;
  onClose: () => void;
}

export const ActionVerificationDefaultProps: ActionVerificationModalProps = {
  title: "",
  message: "",
  buttons: [],
  isOpen: false,
  onClose: () => {},
};

const ActionVerificationModal: React.FC<
  Readonly<ActionVerificationModalProps>
> = ({ title, message, buttons, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ModalConfirmationMessage message={message} buttons={buttons} />
    </Modal>
  );
};

export default ActionVerificationModal;
