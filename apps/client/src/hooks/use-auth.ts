import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/api-client";

export function useAuth(shouldRedirect?: boolean) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [router, shouldRedirect]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      redirectToLogin();
      return;
    }

    apiClient.auth
      .authControllerGetProfile()
      .then((data: any) => {
        setIsAuthenticated(true);
        setEmail(data.email);
        setUserId(data.userId);
      })
      .catch(() => {
        redirectToLogin();
      });
  }, [redirectToLogin, router, shouldRedirect]);

  return { isAuthenticated, email, userId };
}
