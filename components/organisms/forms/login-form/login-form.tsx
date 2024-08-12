"use client";

import { Button, TextInput } from "@tremor/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import useLoginForm from "@/hooks/use-login-form";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import BasicForm from "@/components/molecules/basic-form/basic-form";

function LoginForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    errorMessages,
    isSubmitting,
    showDisabled,
    showSubmitError,
    submitError,
    requiresSecondFactor,
  } = useLoginForm();
  const router = useRouter();

  // focus on first input
  useEffect(() => {
    document.getElementById("username")?.focus();
  }, []);

  const inputContainerStyle = "flex flex-col gap-2";
  const inputLabelStyle =
    "text-tremor-default text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis font-semibold";

  return (
    <>
      <BasicForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showDisabled={showDisabled}
        showSubmitError={showSubmitError}
        submitError={submitError}
      >
        <InputGroup
          label="Email"
          error={!!errorMessages?.username}
          errorMessage={errorMessages?.username}
        >
          <TextInput
            id="username"
            placeholder="jdough@example.com"
            name="username"
            value={values.username}
            onChange={handleChange}
            error={!!errorMessages?.username}
          />
        </InputGroup>
        <InputGroup
          label="Password"
          error={!!errorMessages?.password}
          errorMessage={errorMessages?.password}
        >
          <TextInput
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={!!errorMessages?.password}
          />
        </InputGroup>
      </BasicForm>
      <div className="w-full flex justify-center mt-4">
        <Link
          href={`/reset-password${values.username.length > 0 ? `?username=${values.username}` : ""}`}
        >
          <Button variant="light" type="button">
            Forgot Password?
          </Button>
        </Link>
      </div>
    </>
  );
}

export default LoginForm;
