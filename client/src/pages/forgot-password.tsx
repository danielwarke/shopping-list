import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { ErrorRenderer } from "@/components/ErrorRenderer";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: apiClient.auth.authControllerForgotPassword,
    onSuccess: () => setSuccess(true),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    forgotPasswordMutation.mutate({
      email,
    });
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        {success && (
          <Alert severity="success" sx={{ marginTop: "2vh" }}>
            If you have an account with us you will receive an email with a link
            to reset your password. You can safely close this tab or return to
            login.
          </Alert>
        )}
        <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
          Enter your email address to reset your password
        </Box>
        <ErrorRenderer
          isError={forgotPasswordMutation.isError}
          error={forgotPasswordMutation.error}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={2}
          marginTop="3vh"
        >
          <TextField
            label="Email"
            fullWidth
            placeholder="jdoe@email.com"
            type="email"
            value={email}
            disabled={success}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            size="large"
            loading={forgotPasswordMutation.isPending}
            disabled={!email || success}
            type="submit"
          >
            Submit
          </LoadingButton>
          <Button onClick={() => router.push("/login")} type="button">
            Return to login
          </Button>
        </Box>
      </form>
    </Container>
  );
}
