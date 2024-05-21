import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { apiClient } from "@/api/api-client";

interface AuthContextValues {
  userId: string;
  email: string;
  emailVerified: boolean | null;
}

export const AuthContext = createContext<AuthContextValues>({
  userId: "",
  email: "",
  emailVerified: null,
});

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(null);

  const redirectToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      redirectToLogin();
      return;
    }

    apiClient.auth
      .authControllerGetProfile()
      .then((data: any) => {
        setEmail(data.email);
        setEmailVerified(data.emailVerified);
        setUserId(data.userId);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        redirectToLogin();
      });
  }, [redirectToLogin, router]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        email,
        emailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContextProvider;
