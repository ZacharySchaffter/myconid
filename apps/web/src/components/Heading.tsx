import clsx from "clsx";
import { PropsWithChildren } from "react";

type HeadingTag = "h1" | "h2" | "h3";

type Props = {
  level: HeadingTag;
  tag?: HeadingTag;
  className?: string;
};

const classNamesByLevel: Record<HeadingTag, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-2xl font-semibold tracking-tight",
  h3: "text-xl font-medium",
};

const Heading: React.FC<PropsWithChildren<Props>> = ({
  tag,
  level,
  className,
  children,
}) => {
  const HeadingTag = tag || level;

  return (
    <HeadingTag className={clsx(classNamesByLevel[level], className)}>
      {children}
    </HeadingTag>
  );
};

export default Heading;
