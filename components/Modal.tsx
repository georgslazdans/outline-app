import React, { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white dark:bg-black rounded-lg shadow-lg 
        w-full max-w-lg mx-auto relative"
      >
        <div>
          <button
            className="absolute top-2 right-2.5 text-gray-600 w-8 h-8 text-3xl"
            onClick={onClose}
          >
            &#x2715; {/* Close Icon */}
          </button>
        </div>
        <div className=" p-6 overflow-auto h-full max-h-[75vh] xl:max-h-[85vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
