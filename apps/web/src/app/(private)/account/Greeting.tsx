"use client";

import { useAuthContext } from "@/context/auth";

const Greeting: React.FC = () => {
  const { username } = useAuthContext();

  return <span>{username ? `Welcome, ${username}` : "Welcome"}</span>;
};

export default Greeting;
