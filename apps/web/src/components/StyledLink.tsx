import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

const StyledLink: React.FC<Props> = ({ href, children, className }) => {
  return (
    <Link
      href={href}
      className={`text-blue-600 hover:underline ${className ?? ""}`}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
