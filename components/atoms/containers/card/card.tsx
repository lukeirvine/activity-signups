import React, { ReactNode } from "react";

type Padding = "default" | "thin";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: Padding;
};

const Card: React.FC<Readonly<CardProps>> = ({
  children,
  className,
  padding = "default",
}) => {
  const paddingStyle: Record<Padding, string> = {
    default: "p-4",
    thin: "p-2",
  };

  return (
    <div
      className={`card bg-base-100 shadow-md border dark:border-black ${paddingStyle[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
