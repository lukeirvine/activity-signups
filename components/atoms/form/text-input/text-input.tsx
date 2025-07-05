import React from "react";

type Variant = "default" | "table" | "ghost";

type TextInputProps = {
  id?: string;
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
  error?: boolean;
  variant?: Variant;
  autoComplete?: "on" | "off";
};

const TextInput: React.FC<Readonly<TextInputProps>> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  className,
  type = "text",
  error,
  variant = "default",
  autoComplete = "on",
}) => {
  const variantStyles: Record<Variant, string> = {
    default: "input-bordered",
    table: "input-ghost",
    ghost: "input-ghost w-full max-w-xs input-sm",
  };

  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`input px-3 text-sm w-full ${variantStyles[variant]} ${className} ${error ? "input-error" : ""}`}
      autoComplete={autoComplete}
    />
  );
};

export default TextInput;
