import React, { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

const Card: React.FC<Readonly<CardProps>> = ({ children, className }) => {
  return (
    <div
      className={`card bg-base-100 shadow-md border dark:border-black p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
