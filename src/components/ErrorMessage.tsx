// src/components/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      className="relative rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      <strong className="font-bold">Error!</strong>
      <span className="ml-2 block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
