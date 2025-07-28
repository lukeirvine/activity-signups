import React, { useEffect, useState } from "react";
import {
  FormErrors,
  getElementError,
  getGenericValidateMessage,
  handleFormChange,
  HookSource,
  validateRequiredFields,
  getErrorMessage as _getErrorMessage,
  DirtyFields,
} from "./use-form-validation";

interface OnValidateParams<T extends Object> {
  values: T;
}

type SubmitErrorType = "api" | "client";

export type FormErrorMessages<T> = {
  [Property in keyof T]?: string;
};

export type FormHooksOnValidate<T extends Object> = (
  values: OnValidateParams<T>,
) => FormErrors<T>;
export type FormHooksOnSubmit<T extends Object> = () => Promise<void | boolean>;

interface ValidationParams<T extends Object> {
  requiredFields: (keyof T)[];
  values: T;
  onValidate?: FormHooksOnValidate<T>;
}

const validate = <T extends Object>({
  requiredFields,
  values,
  onValidate,
}: ValidationParams<T>) => {
  let errors = validateRequiredFields(requiredFields, values);
  errors = { ...errors, ...onValidate?.({ values }) };
  const hasErrors = Object.values(errors).some((e) => e && e.type);
  return { errors, hasErrors };
};

export interface FormState<T extends Object> {
  errors?: FormErrors<T>;
  hasErrors: boolean;
  submitError?: string[];
  submitErrorType: SubmitErrorType;
  submitSuccessful: boolean;
  hasSubmitted: boolean;
  isSubmitting: boolean;
  values: T;
  isDirty: boolean;
  dirtyFields?: DirtyFields<T>;
}

interface Props<T extends Object> {
  requiredFields: (keyof T)[];
  initialize: () => T;
  onSubmit: FormHooksOnSubmit<T>;
  onValidate?: FormHooksOnValidate<T>;
  source?: HookSource;
}

const useFormHooks = <T extends Object>({
  requiredFields,
  initialize,
  onSubmit,
  onValidate,
  source,
}: Props<T>) => {
  const [formState, setFormState] = useState<FormState<T>>({
    hasErrors: false,
    submitErrorType: "api",
    hasSubmitted: false,
    isSubmitting: false,
    values: initialize(),
    submitSuccessful: false,
    isDirty: false,
  });
  const getError = getElementError(formState.errors, formState.hasSubmitted);
  const getErrorMessage = (field: keyof T, label?: string) => {
    const error = getError(field);
    if (error && error.type) {
      return _getErrorMessage(error, label);
    }
  };
  const errorMessages = formState.errors
    ? Object.keys(formState.errors).reduce((prev, key) => {
        prev[key as keyof T] = getErrorMessage(key as keyof T);
        return prev;
      }, {} as FormErrorMessages<T>)
    : undefined;
  let submitErrorResolved = false;
  if (formState.submitErrorType === "client") {
    submitErrorResolved = !formState.hasErrors;
  }

  useEffect(() => {
    const _errors = validate({
      requiredFields,
      values: formState.values,
      onValidate,
    });
    setFormState((state) => ({
      ...state,
      ..._errors,
    }));
  }, [requiredFields, formState.values, onValidate]);

  const handleChange = handleFormChange({ setFormState, initialize });

  const reset = (values?: T) => {
    setFormState({
      hasErrors: false,
      submitErrorType: "api",
      hasSubmitted: false,
      isSubmitting: false,
      values: values || initialize(),
      submitSuccessful: false,
      isDirty: false,
    });
  };

  const setSubmitError = (message: string[]) => {
    setFormState((state) => ({
      ...state,
      hasErrors: true,
      submitError: message,
      submitSuccessful: false,
      isSubmitting: false,
    }));
  };

  const updateValues = (newValues: Partial<T>) => {
    setFormState((state) => ({
      ...state,
      values: {
        ...state.values,
        ...newValues,
      },
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    /* istanbul ignore next */
    if (formState.isSubmitting) {
      return;
    }
    const _errors = validate({
      requiredFields,
      values: formState.values,
      onValidate,
    });
    setFormState((state) => ({
      ...state,
      ..._errors,
      isSubmitting: true,
      hasSubmitted: true,
      submitError: undefined,
      submitErrorType: "api",
      ...(_errors.hasErrors
        ? {
            submitErrorType: "client",
            isSubmitting: false,
            submitError: getGenericValidateMessage(),
          }
        : {}),
    }));
    if (_errors.hasErrors) {
      return;
    }

    const result = await onSubmit();
    if (result === true) {
      setFormState((state) => ({
        ...state,
        submitSuccessful: true,
      }));
    } else if (result === false) {
      setFormState((state) => ({
        ...state,
        isSubmitting: false,
      }));
    }
  };

  return {
    ...formState,
    handleChange,
    handleSubmit,
    errorMessages,
    showDisabled:
      formState.isSubmitting || (formState.hasSubmitted && formState.hasErrors),
    showSubmitError: !!formState.submitError && !submitErrorResolved,
    updateValues,
    reset,
    getError,
    getErrorMessage,
    setFormState,
    setSubmitError,
  };
};

export default useFormHooks;
