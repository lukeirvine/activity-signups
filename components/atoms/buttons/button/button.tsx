import Link from "next/link";
import React, { ReactNode } from "react";

export type Variant = "primary" | "ghost" | "none" | "link" | "outline";

type Size = "sm" | "md" | "lg";

type Color =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

type ButtonBaseProps = {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: Variant;
  color?: Color;
  size?: Size;
  id?: string;
  as?: "button";
  type?: "button" | "submit" | "reset";
};

interface ButtonProps extends ButtonBaseProps {}

interface LinkProps extends Omit<ButtonBaseProps, "as"> {
  as: "link";
  href: string;
  target?: string;
}

type CombinedButtonProps = ButtonProps | LinkProps;

const Button: React.FC<Readonly<CombinedButtonProps>> = ({
  children,
  loading,
  disabled,
  onClick,
  className,
  as = "button",
  variant = "primary",
  color = "primary",
  size = "md",
  id,
  type,
  ...props
}) => {
  const href = as === "link" ? (props as LinkProps).href : undefined;
  const target = as === "link" ? (props as LinkProps).target : "";

  const btnVariant: Record<Variant, string> = {
    primary: "btn btn-primary",
    ghost: "btn btn-ghost",
    link: "btn btn-link",
    outline: "btn btn-outline",
    none: "",
  };

  const btnColor: Record<Color, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    info: "btn-info",
    neutral: "btn-neutral",
  };

  const btnSize: Record<Size, string> = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const contents = (
    <>
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        children
      )}
    </>
  );
  const fullClassName = `${btnVariant[variant]} ${btnSize[size]} ${btnColor[color]} ${className ?? ""}`;

  if (as === "link" && href) {
    return (
      <Link href={href} target={target} id={id} className={fullClassName}>
        {contents}
      </Link>
    );
  } else {
    return (
      <button
        className={fullClassName}
        onClick={onClick}
        disabled={disabled}
        id={id}
        type={type}
      >
        {contents}
      </button>
    );
  }
};

export default Button;
