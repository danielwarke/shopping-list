import { Box, Button, Container, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { apiClient } from "@/api/api-client";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { ErrorRenderer } from "@/components/ErrorRenderer";

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Box marginTop="3vh" marginBottom="1em" sx={{ typography: "h5" }}>
          Login to view your shopping lists
        </Box>
        <ErrorRenderer
          isError={loginMutation.isError}
          error={loginMutation.error}
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
            loading={loginMutation.isPending}
            disabled={!email || !password}
            type="submit"
          >
            Login
          </LoadingButton>
          {loginMutation.isError && (
            <Button
              onClick={() => router.push("/forgot-password")}
              type="button"
              color="error"
              sx={{ marginTop: "2vh" }}
            >
              Forgot password?
            </Button>
          )}
          <Button onClick={() => router.push("/sign-up")} type="button">
            Don&apos;t have an account yet?
          </Button>
        </Box>
      </form>
    </Container>
  );
}
