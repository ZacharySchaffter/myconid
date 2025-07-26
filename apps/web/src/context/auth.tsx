"use client";

import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useContext, useMemo, useState } from "react";

type AuthContextData = {
  isLoggedIn: boolean;
  username: string | null;
  logout: () => Promise<void>;
};

const defaultData: AuthContextData = {
  isLoggedIn: false,
  username: null,
  logout: () => Promise.reject("not initialized"),
};

const AuthContext = React.createContext(defaultData);
type Props = {
  session: string | null;
};

export const AuthContextProvider: React.FC<PropsWithChildren<Props>> = ({
  session,
  children,
}) => {
  const [isAuthed, setIsAuthed] = useState(!!session);
  const router = useRouter();

  // TODO: Fetch user details and persist them here
  const ctx = useMemo(() => {
    return {
      isLoggedIn: isAuthed,
      username: null,
      logout: async () => {
        return fetch("/api/auth/logout", { method: "POST" })
          .then(() => {
            console.log("logout successful, redirecting to homepage");
            setIsAuthed(false);
            router.push("/");
          })
          .catch((err) => {
            console.log("logout error:", err);
          });
      },
    };
  }, [isAuthed, router]);

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
