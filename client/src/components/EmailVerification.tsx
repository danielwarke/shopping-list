import { Alert, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { useSnackbarContext } from "@/contexts/SnackbarContext";
import { useAuthContext } from "@/contexts/AuthContext";

export const EmailVerification = () => {
  const { showMessage } = useSnackbarContext();
  const { email, emailVerified } = useAuthContext();
  const router = useRouter();
  const token = router.query.emailVerify as string;

  const [success, setSuccess] = useState(false);

  const requestEmailVerificationMutation = useMutation({
    mutationFn: apiClient.auth.authControllerRequestVerificationEmail,
    onSuccess: () =>
      showMessage(
        `A request to verify your email address has been sent to ${email}`,
      ),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: apiClient.auth.authControllerVerifyEmail,
    onSuccess: () => setSuccess(true),
  });

  useEffect(() => {
    if (
      token &&
      !success &&
      !verifyEmailMutation.isError &&
      !verifyEmailMutation.isPending
    ) {
      verifyEmailMutation.mutate({ token });
    }
  }, [success, token, verifyEmailMutation]);

  if (success) {
    return (
      <Alert severity="success">Email address verified successfully.</Alert>
    );
  }

  if (emailVerified || emailVerified === null) {
    return null;
  }

  if (token) {
    return (
      <ErrorRenderer
        isError={verifyEmailMutation.isError}
        error={verifyEmailMutation.error}
      />
    );
  }

  return (
    <>
      <ErrorRenderer
        isError={requestEmailVerificationMutation.isError}
        error={requestEmailVerificationMutation.error}
      />
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => requestEmailVerificationMutation.mutate({})}
          >
            Resend Email
          </Button>
        }
      >
        Your email address has not been verified yet.
      </Alert>
    </>
  );
};
