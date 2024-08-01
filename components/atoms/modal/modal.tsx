import React, { ReactNode, useEffect } from 'react';

type ModalProps = {
	id: string;
  onClose?: () => void;
};

export const showModal = (id: string) => {
  const dialogElement = document.getElementById(id) as HTMLDialogElement | null;
  dialogElement?.showModal();
}

const Modal: React.FC<Readonly<ModalProps>> = ({ id, onClose }) => {
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
      <h3 className="text-lg font-bold">Hello!</h3>
      <p className="py-4">Press ESC key or click the button below to close</p>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
};

export default Modal;
