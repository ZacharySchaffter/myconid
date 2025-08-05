"use client";

import { Session } from "@/lib/session.server";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useContext, useMemo, useState } from "react";

type UserCredentials = {
  username: string;
  password: string;
};

type AuthContextData = {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  logout: () => Promise<void>;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
};

const defaultData: AuthContextData = {
  isLoggedIn: false,
  username: null,
  token: null,
  logout: () => Promise.reject("not initialized"),
  login: () => Promise.reject("not initialized"),
  register: () => Promise.reject("not initialized"),
};

const AuthContext = React.createContext(defaultData);
type Props = {
  session: Session | null;
};

export const AuthContextProvider: React.FC<PropsWithChildren<Props>> = ({
  session,
  children,
}) => {
  const [isAuthed, setIsAuthed] = useState(!!session);
  const router = useRouter();

  const [username, setUsername] = useState(session?.username || null);
  const [token, setToken] = useState(session?.token || null);

  const ctx = useMemo(() => {
    return {
      isLoggedIn: isAuthed,
      token: token,
      username: username,
      login: async (credentials: UserCredentials) => {
        return fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(`login error: ${res.status} - ${res.statusText}`);
          }
          const data = await res.json();
          debugger;
          setToken(data.token);
          setUsername(data.username);
          setIsAuthed(true);
          router.push("/account");
        });
      },
      register: async (credentials: UserCredentials) => {
        return fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(credentials),
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(
              `registration error: ${res.status} - ${res.statusText}`
            );
          }
          const data = await res.json();
          debugger;
          setToken(data.token);
          setUsername(data.username);
          setIsAuthed(true);
          router.push("/account");
        });
      },
      logout: async () => {
        return fetch("/api/auth/logout", { method: "POST" })
          .then(() => {
            console.log("logout successful, redirecting to homepage");
            setUsername(null);
            setToken(null);
            setIsAuthed(false);
            router.push("/");
          })
          .catch((err) => {
            console.log("logout error:", err);
          });
      },
    };
  }, [isAuthed, router, token, username]);

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
