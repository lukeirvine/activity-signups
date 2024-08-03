import React, { ReactNode } from 'react';

type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
  error?: boolean;
  errorMessage?: string;
};

const TextInput: React.FC<Readonly<TextInputProps>> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  className,
  type = "text",
  error,
  errorMessage,
}) => {
	return <div>
    <div className="label">
      <span className="label-text">{label}</span>
    </div>
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`input input-bordered w-full ${className} ${error ? 'input-error' : ''}`}
    />
    {error && <div className="label">
      <span className="label-text-alt text-error">{errorMessage}</span>
    </div>}
  </div>;
};

export default TextInput;
