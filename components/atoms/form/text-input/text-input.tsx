import React from "react";

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
}) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`input px-3 text-sm input-bordered w-full ${className} ${error ? "input-error" : ""}`}
    />
  );
};

export default TextInput;
