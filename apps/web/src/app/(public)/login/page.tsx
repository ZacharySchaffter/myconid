import Heading from "@/components/Heading";
import LoginForm from "@/components/LoginForm";
import StyledLink from "@/components/StyledLink";

const LoginPage: React.FC = () => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center flex-grow">
      <Heading level="h1" className="mb-4">
        Login
      </Heading>
      <p className="pb-3">
        Welcome back! Log into your account to identify mushrooms
      </p>
      <LoginForm className="mx-auto w-full max-w-md border border-black py-6 px-4 rounded-md" />
      <p className="mt-4 text-center">
        Don&apos;t have an account?
        <br />
        <StyledLink href="/create-account">Create one now</StyledLink>
      </p>
    </div>
  );
};

export default LoginPage;
