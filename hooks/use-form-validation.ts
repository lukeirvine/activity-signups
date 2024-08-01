import { Dispatch, SetStateAction } from "react";
import isMobilePhone from "validator/lib/isMobilePhone";
import { FormState } from "./use-form-hooks";

interface HandleChangeParams<T extends Object> {
  // values: T;
  setFormState: Dispatch<SetStateAction<FormState<T>>>;
  initialize?: () => T;
  getExtras?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => Partial<T>;
}

export const handleCheck =
  <T extends Object>({ setFormState, getExtras }: HandleChangeParams<T>) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const extras = getExtras ? getExtras(e) : {};
  };

export const handleFormChange =
  <T extends Object>({
    setFormState,
    getExtras,
    initialize,
  }: HandleChangeParams<T>) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const extras = getExtras ? getExtras(e) : {};
    const _values = {
      ...extras,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "radio" && typeof value === "string"
            ? value
            : type === "radio"
              ? !!+value
              : value,
    };
    const valueIsDirty =
      !!initialize && initialize()[name as keyof T] !== value;
    setFormState((state) => {
      const newValues = { ...state.values, ..._values };
      const isDirty =
        !!initialize &&
        JSON.stringify(initialize()) !== JSON.stringify(newValues);
      return {
        ...state,
        isDirty,
        dirtyFields: {
          ...state.dirtyFields,
          [name]: valueIsDirty,
        },
        values: {
          ...state.values,
          ..._values,
        },
      };
    });
    return _values;
  };

export const EMAIL_VALIDATION = /([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})/i;
export const MIN_PASSWORD_LENGTH = 12;

type FormErrorType =
  | "required"
  | "maxLength"
  | "minLength"
  | "custom"
  | "passwordStrength"
  | "confirmation"
  | "privacyPolicy";

export interface FormError {
  type: FormErrorType;
  message?: string;
  minMaxNumber?: number;
  intlValues?: any;
}

export type FormErrors<T> = {
  [Property in keyof T]?: FormError;
};

export type DirtyFields<T> = {
  [Property in keyof T]?: boolean;
};

export const validateRequiredFields = <T>(
  requiredFields: (keyof T)[],
  values: T,
) => {
  const errors: FormErrors<T> = {};

  for (const field of requiredFields) {
    if (
      (typeof values[field] != "boolean" &&
        (!values[field] ||
          (typeof values[field] != "number" &&
            typeof values[field] != "object" &&
            !(values[field] as any).length))) ||
      (typeof values[field] == "boolean" && (values[field] as any) === false) ||
      (typeof values[field] == "boolean" && values[field] === undefined) ||
      (typeof values[field] == "object" && !values[field])
    ) {
      errors[field] = {
        type: "required",
      };
    }
  }
  return errors;
};

export const validateURL = (
  url: string,
  errorMessage?: string,
): FormError | undefined => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  if (!!!pattern.test(url)) {
    return {
      type: "custom",
      message: errorMessage ? errorMessage : "Please enter a valid url.",
    };
  }
};

export const validateStartEndDate = (
  startDate: string,
  endDate: string,
  errorMessage?: string,
): FormError | undefined => {
  if (Date.parse(startDate) >= Date.parse(endDate)) {
    return {
      type: "custom",
      message: errorMessage
        ? errorMessage
        : "End date should be greater than Start date",
    };
  }
};

export const validateEmail = (
  email?: string,
  errorMessage?: string,
): FormError | undefined => {
  if (email && email.length && !EMAIL_VALIDATION.test(email)) {
    return {
      type: "custom",
      message: errorMessage
        ? errorMessage
        : "Please enter a valid email address.",
    };
  }
};

export const validateMobilePhone = (
  phone?: string,
  errorMessage?: string,
): FormError | undefined => {
  if (
    phone &&
    phone.length &&
    !isMobilePhone(phone, ["en-US", "en-CA", "es-MX"])
  ) {
    return {
      type: "custom",
      message: errorMessage
        ? errorMessage
        : "Please enter a valid phone number.",
    };
  }
};

export const validateFieldConfirmation = (
  field1?: string,
  field2?: string,
): FormError | undefined => {
  if (field1 && field1.length && field2 && field2.length && field1 !== field2) {
    return {
      type: "confirmation",
    };
  }
};

export const validatePassword = (password: string): FormError | undefined => {
  if (password && password.length && password.length < MIN_PASSWORD_LENGTH) {
    return {
      type: "minLength",
      minMaxNumber: MIN_PASSWORD_LENGTH,
    };
  }
};

interface ValidateMinMaxLengthParams {
  value: string;
  min?: number;
  max?: number;
}
export const validateMinMaxLength = ({
  value,
  min,
  max,
}: ValidateMinMaxLengthParams): FormError | undefined => {
  if (min && value && value.length < min) {
    return {
      type: "minLength",
      minMaxNumber: min,
    };
  }
  if (max && value && value.length > max) {
    return {
      type: "maxLength",
      minMaxNumber: max,
    };
  }
};

export const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (/[A-Z]/.test(password)) {
    score++;
  }
  if (/\d/.test(password)) {
    score++;
  }
  if (/\W/.test(password)) {
    score++;
  }
  if (/[a-z]/.test(password)) {
    score++;
  }
  return score;
};

// where the hook is initiate from.
export type HookSource = "view" | "form";
export const getGenericValidateMessage = (source?: HookSource) => {
  if (source === "view") {
    return [
      "You are missing one or more required fields. Click edit and save any required fields before proceeding.",
    ];
  }
  return ["Please correct the fields above in red and try again."];
};

export const GENERIC_ERROR = [
  "There was an error processing your request. Please try again.",
];

export const getErrorMessage = (error: FormError, label?: string) => {
  if (error.type === "required") {
    if (label) {
      return `Please enter your ${label}`;
    }
    return "This field is required";
  }
  if (error.type === "custom" && error.message) {
    return error.message;
  }
  if (error.type === "maxLength") {
    if (label) {
      return `${label} is too long (maximum is ${error.minMaxNumber} characters).`;
    }
    return `This field can only be ${error.minMaxNumber} characters.`;
  }
  if (error.type === "minLength") {
    if (label) {
      return `${label} is too short (minimum is ${error.minMaxNumber} characters).`;
    }
    return `This field must be at least ${error.minMaxNumber} characters.`;
  }
  if (error.type === "confirmation") {
    return "These fields don't match. Please try again.";
  }
  if (error.type === "passwordStrength") {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain a number, lower case character, upper case character, and a non-alphanumeric character.`;
  }
  return "This field has an error.";
};

interface SetErrorMessageParams<T> {
  response: Response;
  setSubmitError: (data: string[]) => void;
  setErrors: Dispatch<SetStateAction<FormErrors<T> | undefined>>;
}

export const setResponseErrorMessages = async <T>({
  response,
  setErrors,
  setSubmitError,
}: SetErrorMessageParams<T>) => {};

export const getElementError =
  <T>(errors: FormErrors<T | undefined>, eventTrigger?: boolean) =>
  (field: keyof T) => {
    if (eventTrigger === undefined) {
      eventTrigger = true;
    }
    if (errors && eventTrigger) {
      return errors[field];
    }
    return undefined;
  };

export const getResponseError = (errors: any[]): string[] => {
  let response: Array<string> = [];
  let formattedError: string = "";

  if (errors && errors.length > 0) {
    for (const error of errors) {
      formattedError = "An unknown error occurred.";
      if (error.extensions) {
        const code = error.extensions.code;
        switch (code) {
          case "BAD_USER_INPUT":
            formattedError =
              "Invalid input, please review your input fields and try again.";
            response.push(formattedError);
            break;
          case "BAD_REQUEST":
            const formErrors: string[] = (error as any).extensions.originalError
              .message;
            response = response.concat(
              [
                "There were errors validating your data. Please check the following fields.",
              ],
              formErrors.map((error) => `${error}.`),
            );
            break;
          default:
            formattedError = error.message;
            response.push(formattedError);
        }
      }
    }
  }
  return response;
};
