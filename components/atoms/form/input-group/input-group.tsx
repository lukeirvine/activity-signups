import React, { ReactNode } from 'react';

type InputGroupProps = {
	children: ReactNode;
  label?: string;
  error?: boolean;
  errorMessage?: string;
};

const InputGroup: React.FC<Readonly<InputGroupProps>> = ({ children, label, error, errorMessage }) => {
	return <div>
    {label && <div className="label">
      <span className="label-text">{label}</span>
    </div>}
    {children}
    {error && <div className="label">
      <span className="label-text-alt text-error">{errorMessage}</span>
    </div>}
  </div>;
};

export default InputGroup;
