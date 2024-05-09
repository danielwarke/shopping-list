import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Alert, Box, Button, CircularProgress, Container } from "@mui/material";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { useAuth } from "@/hooks/use-auth";

export default function AcceptListInvite() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const token = router.query.token as string;

  const acceptInviteMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerAcceptInvite,
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    if (
      token &&
      isAuthenticated &&
      !acceptInviteMutation.isError &&
      !acceptInviteMutation.isPending
    ) {
      acceptInviteMutation.mutate({ token });
    }
  }, [token, acceptInviteMutation, isAuthenticated]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginBottom: "2vh" }}></Box>
      {acceptInviteMutation.isPending && <CircularProgress />}
      {!token && (
        <Alert severity="error">
          Unable to accept shopping list invite: token must be provided
        </Alert>
      )}
      {!isAuthenticated && !!token && (
        <Alert severity="error">
          Please login before accepting shopping list invite
        </Alert>
      )}
      <ErrorRenderer
        isError={acceptInviteMutation.isError}
        error={acceptInviteMutation.error}
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
