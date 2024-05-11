import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Alert, Box, Button, CircularProgress, Container } from "@mui/material";
import { ErrorRenderer } from "@/components/ErrorRenderer";

export default function VerifyEmail() {
  const router = useRouter();
  const token = router.query.token as string;

  const [success, setSuccess] = useState(false);

  const verifyEmailMutation = useMutation({
    mutationFn: apiClient.auth.authControllerVerifyEmail,
    onSuccess: () => setSuccess(true),
  });

  useEffect(() => {
    if (
      !success &&
      token &&
      !verifyEmailMutation.isError &&
      !verifyEmailMutation.isPending
    ) {
      verifyEmailMutation.mutate({ token });
    }
  }, [success, token, verifyEmailMutation]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginBottom: "2vh" }}></Box>
      {verifyEmailMutation.isPending && <CircularProgress />}
      {success && (
        <Alert severity="success">
          Email address verified successfully, please return to the login page.
        </Alert>
      )}
      {!token && (
        <Alert severity="error">
          Unable to verify email address: token must be provided
        </Alert>
      )}
      <ErrorRenderer
        isError={verifyEmailMutation.isError}
        error={verifyEmailMutation.error}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        marginTop="3vh"
      >
        <Button onClick={() => router.push("/login")} type="button">
          Return to login
        </Button>
      </Box>
    </Container>
  );
}
