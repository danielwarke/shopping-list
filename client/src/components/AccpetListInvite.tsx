import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { shoppingListsQueryKey } from "@/api/query-keys";

export const AcceptListInvite = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const token = router.query.invite as string;

  const acceptInviteMutation = useMutation({
    mutationFn: apiClient.listSharing.listSharingControllerAcceptInvite,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: shoppingListsQueryKey }),
  });

  useEffect(() => {
    if (
      token &&
      !acceptInviteMutation.isError &&
      !acceptInviteMutation.isPending
    ) {
      acceptInviteMutation.mutate({ token });
    }
  }, [token, acceptInviteMutation]);

  if (!token) {
    return null;
  }

  return (
    <ErrorRenderer
      isError={acceptInviteMutation.isError}
      error={acceptInviteMutation.error}
    />
  );
};
