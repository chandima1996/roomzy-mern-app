import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import useAuthStore from "../store/authStore";

const AuthManager = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const syncWithZustand = async () => {
      if (user) {
        const token = await getToken();

        setAuth(user, token);
      } else {
        clearAuth();
      }
    };

    syncWithZustand();
  }, [user, getToken, setAuth, clearAuth]);
  return null;
};

export default AuthManager;
