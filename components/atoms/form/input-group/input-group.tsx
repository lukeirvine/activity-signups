import React, { ReactNode } from "react";

type Variant = "default" | "inline";

type InputGroupProps = {
  children: ReactNode;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  variant?: Variant;
  tooltip?: string;
};

const InputGroup: React.FC<Readonly<InputGroupProps>> = ({
  children,
  label,
  error,
  errorMessage,
  className,
  variant = "default",
  tooltip,
}) => {
  const containerClass: Record<Variant, string> = {
    default: "",
    inline: "flex items-center gap-1",
  };

  const labelClass: Record<Variant, string> = {
    default: "",
    inline: "flex-none font-semibold",
  };

  const errorElement = (
    <div className="label">
      <span className="label-text-alt text-error">{errorMessage}</span>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className={`${containerClass[variant]}`}>
        {label && (
          <div className={`${tooltip ? "tooltip" : ""}`} data-tip={tooltip}>
            <div className={`label ${labelClass[variant]}`}>
              <span className="label-text">
                {label}
                {variant === "inline" && ":"}
              </span>
            </div>
          </div>
        )}
        {children}
      </div>
      {error && errorElement}
    </div>
  );
};

export default InputGroup;
