import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {
  className?: string;
};
const Overlay: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
  ...otherProps
}) => {
  return (
    <div
      {...otherProps}
      className={clsx(
        "text-center fixed top-0 left-0 right-0 bottom-0  z-[9999] pointer-events-auto",
        "flex items-center justify-center",
        "bg-slate-500/80 text-white",
        className
      )}
    >
      <div className="text-lg font-bold">{children}</div>
    </div>
  );
};

export default Overlay;
