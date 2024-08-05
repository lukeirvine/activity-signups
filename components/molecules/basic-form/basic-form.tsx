import Button from '@/components/atoms/button/button';
import React, { ReactNode } from 'react';

type BasicFormProps = {
	children: ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  showDisabled: boolean;
  showSubmitError: boolean;
  submitError?: string[];
};

const BasicForm: React.FC<Readonly<BasicFormProps>> = ({
  children,
  handleSubmit,
  isSubmitting,
  showDisabled,
  showSubmitError,
  submitError,
}) => {
	return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {children}
        </div>
        <div>
          <Button
            loading={isSubmitting}
            disabled={showDisabled}
            className="w-full"
          >
            Submit
          </Button>
          {showSubmitError && (
            <div className="label">
              <span className="label-text-alt text-error">{submitError ? submitError[0] : ''}</span>
            </div>
          )}
        </div>
      </div>
    </form>
  )
};

export default BasicForm;
