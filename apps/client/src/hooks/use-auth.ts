import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/api-client";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    apiClient.auth
      .authControllerGetProfile()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  return isAuthenticated;
}
