"use client";

import CreateAccountForm from "@/components/CreateAccountForm";
import Heading from "@/components/Heading";
import StyledLink from "@/components/StyledLink";

const CreateAccountPage: React.FC = () => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center flex-grow">
      <Heading level="h1" className="mb-4">
        Create your account
      </Heading>
      <p className="pb-3">
        Create an account to start identifying fungi for free
      </p>
      <CreateAccountForm className="mx-auto w-full max-w-md border border-black py-6 px-4 rounded-md" />
      <p className="mt-4 text-center">
        Already have an account?
        <br />
        <StyledLink href="/login">Login now</StyledLink>
      </p>
    </div>
  );
};

export default CreateAccountPage;
