import React from "react";

type Variant = "default" | "table";

type TextInputProps = {
  id?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
  error?: boolean;
  variant?: Variant;
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
}) => {
  const variantStyles: Record<Variant, string> = {
    default: "input-bordered",
    table: "input-ghost",
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
    />
  );
};

export default TextInput;
