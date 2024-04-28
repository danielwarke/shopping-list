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

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: apiClient.auth.authControllerLogin,
    onSuccess: (data) => {
      const token = (data as any).access_token;
      localStorage.setItem("auth_token", token);
      router.push("/shopping-lists");
    },
  });

  function handleSubmit() {
    loginMutation.mutate({
      email,
      password,
    });
  }

  const errorMessages = getErrorMessages(loginMutation.error);

  return (
    <Container maxWidth="sm">
      <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
        Login to view your shopping lists
      </Box>
      {loginMutation.isError && (
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
          label="Email"
          fullWidth
          placeholder="jdoe@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoadingButton
          variant="contained"
          size="large"
          onClick={handleSubmit}
          loading={loginMutation.isPending}
          disabled={!email || !password}
        >
          Login
        </LoadingButton>
        <Button onClick={() => router.push("/sign-up")}>
          Don't have an account yet?
        </Button>
      </Box>
    </Container>
  );
}
