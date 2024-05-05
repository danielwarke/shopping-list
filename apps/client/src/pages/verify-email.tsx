import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { getErrorMessages } from "@/api/utils";
import { Alert, Box, Button, Container } from "@mui/material";

export default function VerifyEmail() {
  const router = useRouter();
  const token = router.query.token as string;

  const [success, setSuccess] = useState(false);

  const verifyEmailMutation = useMutation({
    mutationFn: apiClient.auth.authControllerVerifyEmail,
    onSuccess: () => setSuccess(true),
  });

  let errorMessages = getErrorMessages(verifyEmailMutation.error);

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
      {verifyEmailMutation.isError && (
        <>
          {errorMessages.map((message) => (
            <Alert key={message} severity="error">
              Unable to verify email address: {message}
            </Alert>
          ))}
        </>
      )}
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
