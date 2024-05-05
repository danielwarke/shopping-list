import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { FormEvent, useState } from "react";
import { getErrorMessages } from "@/api/utils";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const token = router.query.token as string;

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: apiClient.auth.authControllerResetPassword,
    onSuccess: () => setSuccess(true),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    resetPasswordMutation.mutate({
      token,
      password,
    });
  }

  const errorMessages = getErrorMessages(resetPasswordMutation.error);

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        {success && (
          <Alert severity="success" sx={{ marginTop: "2vh" }}>
            Password reset successfully, please return to the login page.
          </Alert>
        )}
        <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
          Please enter a new password
        </Box>
        {resetPasswordMutation.isError && (
          <>
            {errorMessages.map((message) => (
              <Alert key={message} severity="error">
                Error: {message}
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
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            disabled={success}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            size="large"
            loading={resetPasswordMutation.isPending}
            disabled={!password || success}
            type="submit"
          >
            Reset Password
          </LoadingButton>
          <Button onClick={() => router.push("/login")} type="button">
            Return to login
          </Button>
        </Box>
      </form>
    </Container>
  );
}
