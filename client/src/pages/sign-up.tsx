import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ErrorRenderer } from "@/components/ErrorRenderer";

export default function SignUp() {
  const router = useRouter();
  const token = router.query.token as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: apiClient.auth.authControllerSignUp,
    onSuccess: () => setSuccess(true),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    signUpMutation.mutate({
      name,
      email,
      password,
      inviteToken: token,
    });
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
          Sign up to start creating your own shopping list
        </Box>
        <ErrorRenderer
          isError={signUpMutation.isError}
          error={signUpMutation.error}
        />
        {success && (
          <Alert severity="success">
            You have signed up successfully! <br />
            Please check your email for a link to verify your account. You can
            safely close this tab.
          </Alert>
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
            label="Name"
            fullWidth
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={success}
          />
          <TextField
            label="Email"
            fullWidth
            placeholder="jdoe@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
          />
          <TextField
            label="Password"
            fullWidth
            placeholder="Make it a good one"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
          />
          {!success && (
            <>
              <LoadingButton
                variant="contained"
                size="large"
                onClick={handleSubmit}
                type="submit"
                loading={signUpMutation.isPending}
                disabled={!name || !email || !password}
              >
                Sign Up
              </LoadingButton>
              <Button type="button" onClick={() => router.push("/login")}>
                Already have an account?
              </Button>
            </>
          )}
        </Box>
      </form>
    </Container>
  );
}
