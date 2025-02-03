"use client";

import { Dictionary } from "@/app/dictionaries";
import { createContext, useState, useContext, ReactNode } from "react";
import ErrorModal from "./ErrorModal";
import deepEqual from "@/lib/utils/Objects";

type ErrorContextType = {
  showError: (error: Error) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

type Props = {
  dictionary: Dictionary;
  children: ReactNode;
};

const asStringArray = (e: any): string[] => {
  const errors: string[] = [];
  if (e instanceof Error) {
    errors.push(e.message);
    if (e.cause) {
      errors.push("" + e.cause);
    }
    if (e.stack) {
      errors.push(e.stack);
    }
  } else {
    errors.push(e);
  }
  return errors;
};

export const ErrorProvider = ({ children, dictionary }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showError = (e: any) => {
    const errors = asStringArray(e);
    if (!deepEqual(errorMessage, errors)) {
      setErrorMessage(errors);
      setIsModalOpen(true);
    }
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {errorMessage && (
        <ErrorModal
          errorMessage={errorMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        ></ErrorModal>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorModal = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useErrorModal must be used within an ErrorProvider");
  }
  return context;
};
