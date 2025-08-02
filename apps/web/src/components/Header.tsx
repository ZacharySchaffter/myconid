"use client";
import { useAuthContext } from "@/context/auth";
import Link from "next/link";
import { useCallback } from "react";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuthContext();
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);
  return (
    <header className="sticky grid grid-cols-3 items-center h-16 px-4 border-b border-gray-200 bg-white">
      <div />

      <div className="justify-self-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Myconid
        </Link>
      </div>

      <div className="justify-self-end">
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
