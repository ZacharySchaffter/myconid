"use client";

import FileDropInput from "@/components/FileInput";
import Heading from "@/components/Heading";
import LoginForm from "@/components/LoginForm";
import MediaUpload from "@/components/MediaUpload";
import StyledLink from "@/components/StyledLink";
import { useAuthContext } from "@/context/auth";

const AccountPage: React.FC = () => {
  const { username } = useAuthContext();
  return (
    <div className="w-full max-w-2xl flex-grow">
      {/* TODO: add username from auth ctx */}
      <span>{username ? `Welcome, ${username}` : "Welcome"}</span>
      <Heading level="h1" className="mb-4">
        Your Dashboard
      </Heading>

      {/* Drag and Drop Media Uploader */}
      <MediaUpload />

      {/* TODO: Collection */}

      {/* TODO: Other uploads */}
    </div>
  );
};

export default AccountPage;
