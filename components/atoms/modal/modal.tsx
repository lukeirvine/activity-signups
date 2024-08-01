import { XMarkIcon } from '@heroicons/react/16/solid';
import React, { ReactNode, useEffect } from 'react';

type ModalProps = {
	id: string;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
};

export const showModal = (id: string) => {
  const dialogElement = document.getElementById(id) as HTMLDialogElement | null;
  dialogElement?.showModal();
}

const Modal: React.FC<Readonly<ModalProps>> = ({ id, onClose, title, children }) => {
  useEffect(() => {
    const dialogElement = document.getElementById(id);

    const handleClose = () => {
      if (onClose) onClose();
    };

    // Attach event listeners
    dialogElement?.addEventListener('close', handleClose);

    // Clean up event listeners when component unmounts
    return () => {
      dialogElement?.removeEventListener('close', handleClose);
    };
  }, []);
  
  return <dialog id={id} className="modal">
    <div className="modal-box">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
      <div className="absolute top-5 right-5">
        <form method="dialog">
          <button className="btn btn-ghost btn-sm">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </dialog>
};

export default Modal;
