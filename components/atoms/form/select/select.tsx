import React from "react";

type Variant = "default" | "table" | "ghost";

type SelectProps = {
  children?: React.ReactNode;
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  variant?: Variant;
};

const Select: React.FC<Readonly<SelectProps>> = ({
  children,
  id,
  name,
  value,
  onChange,
  disabled,
  className,
  error,
  variant = "default",
}) => {
  const variantStyles: Record<Variant, string> = {
    default: "select-bordered",
    table: "select-ghost",
    ghost: "select-ghost select-sm text-xs w-auto",
  };

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`select px-3 text-sm w-full ${variantStyles[variant]} ${className} ${error ? "input-error" : ""}`}
    >
      {children}
    </select>
  );
};

export default Select;
