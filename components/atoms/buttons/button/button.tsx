import React, { ReactNode } from "react";

export type Variant = "primary" | "ghost" | "none";

type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: Variant;
  size?: Size;
  id?: string;
};

const Button: React.FC<Readonly<ButtonProps>> = ({
  children,
  loading,
  disabled,
  onClick,
  className,
  variant = "primary",
  size = "md",
  id,
}) => {
  const btnVariant: Record<Variant, string> = {
    primary: "btn btn-primary",
    ghost: "btn btn-ghost",
    none: "",
  };

  const btnSize: Record<Size, string> = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      className={`${btnVariant[variant]} ${btnSize[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      id={id}
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
