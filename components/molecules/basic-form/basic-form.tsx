import React, { ReactNode } from "react";
import Button from "@/components/atoms/buttons/button/button";

type ButtonVariant = "full" | "minimal";

type BasicFormProps = {
  children: ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  showDisabled: boolean;
  showSubmitError: boolean;
  submitError?: string[];
  buttonVariant?: ButtonVariant;
  isDirty?: boolean;
};

const BasicForm: React.FC<Readonly<BasicFormProps>> = ({
  children,
  handleSubmit,
  isSubmitting,
  showDisabled,
  showSubmitError,
  submitError,
  buttonVariant = "full",
  isDirty,
}) => {
  const buttonClass: Record<ButtonVariant, string> = {
    full: "w-full",
    minimal: "btn-sm",
  };

  return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">{children}</div>
        <div>
          <Button
            loading={isSubmitting}
            disabled={showDisabled || isSubmitting || isDirty === false}
            className={`${buttonClass[buttonVariant]}`}
          >
            Submit
          </Button>
          {showSubmitError && (
            <div className="label">
              <span className="label-text-alt text-error">
                {submitError ? submitError[0] : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default BasicForm;
