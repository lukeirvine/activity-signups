import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<Readonly<ButtonProps>> = ({
  children,
  loading,
  disabled,
  onClick,
  className,
}) => {
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
