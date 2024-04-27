import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import Alert from "@mui/material/Alert";
import { getErrorMessages } from "@/api/utils";
import { apiClient } from "@/api/api-client";
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";

export const SignUpForm: FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: apiClient.auth.authControllerSignUp,
    onSuccess: () => setSuccess(true),
  });

  function handleSubmit() {
    signUpMutation.mutate({
      name,
      email,
      password,
    });
  }

  const errorMessages = getErrorMessages(signUpMutation.error);

  return (
    <Container maxWidth="sm">
      <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
        Sign up to start creating your own shopping list
      </Box>
      {signUpMutation.isError && (
        <>
          {errorMessages.map((message) => (
            <Alert key={message} severity="error">
              Error: {message}
            </Alert>
          ))}
        </>
      )}
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
              loading={signUpMutation.isPending}
              disabled={!name || !email || !password}
            >
              Sign Up
            </LoadingButton>
            <Button onClick={() => router.push("/")}>
              Already have an account?
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};
