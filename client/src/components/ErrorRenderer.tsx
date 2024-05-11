import { FC } from "react";
import { getErrorMessages } from "@/api/utils";
import { Alert } from "@mui/material";

interface ErrorRendererProps {
  isError: boolean;
  error: Error | null;
}

export const ErrorRenderer: FC<ErrorRendererProps> = ({ isError, error }) => {
  const errorMessages = getErrorMessages(error);

  if (!isError) {
    return null;
  }

  return (
    <>
      {errorMessages.map((message) => (
        <Alert key={message} severity="error">
          Error: {message}
        </Alert>
      ))}
    </>
  );
};
