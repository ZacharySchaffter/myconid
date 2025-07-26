"use client";

import { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  className?: string;
};

const LoginForm: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Login failed");
        setLoading(false);
        return;
      }

      router.push("/account");
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <Label htmlFor="username" className="mb-3">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />
        </div>

        <div className="w-full">
          <Label htmlFor="password" className="mb-3">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 my-3">{error}</p>}

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
