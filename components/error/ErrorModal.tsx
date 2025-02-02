import React from "react";
import ErrorMessage from "./ErrorMessage";
import Button from "../Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string[];
};

const ErrorModal = ({ isOpen, onClose, errorMessage }: Props) => {
  if (!isOpen) return null;

  const copyErrorToClipboard = () => {
    const errorText = errorMessage.join("\n"); // Join the error messages with newline if it's an array
    navigator.clipboard
      .writeText(errorText)
      .then(() => {})
      .catch((err) => {
        console.error("Failed to copy to clipboard", err);
        alert("Failed to copy error message: ");
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &#x2715; {/* Close Icon */}
        </button>
        {errorMessage.map((it, index) => {
          return (
            <div key={"error-message-" + index}>
              <ErrorMessage key={index} text={it}></ErrorMessage>
              <br></br>
            </div>
          );
        })}
        <div className="flex flex-row gap-4">
          <Button onClick={copyErrorToClipboard}>
            <label>Copy</label>
          </Button>
          <Button onClick={() => onClose()} style="secondary">
            <label>Close</label>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
