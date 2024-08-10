"use client";

import { Button, Callout, TextInput } from "@tremor/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import useLoginForm from "@/hooks/use-login-form";
import CardTitle from "@/components/atoms/text/card-title/card-title";

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
      <form method="post" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-10">
          <CardTitle>Sign In</CardTitle>
          <div className="flex flex-col gap-6">
            <div className={`${inputContainerStyle}`}>
              <label className={`${inputLabelStyle}`} htmlFor="email">
                Email
              </label>
              <TextInput
                id="username"
                placeholder="jdough@example.com"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={!!errorMessages?.username}
                errorMessage={errorMessages?.username}
              />
            </div>
            <div className={`${inputContainerStyle}`}>
              <label className={`${inputLabelStyle}`} htmlFor="password">
                Password
              </label>
              <TextInput
                placeholder="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={!!errorMessages?.password}
                errorMessage={errorMessages?.password}
              />
            </div>
            {showSubmitError && (
              <Callout title="Submission Error" color="rose">
                {submitError}
              </Callout>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <Button
              loading={isSubmitting}
              disabled={showDisabled}
              type="submit"
            >
              Sign In
            </Button>
            <div className="w-full flex justify-center">
              <Link
                href={`/reset-password${values.username.length > 0 ? `?username=${values.username}` : ""}`}
              >
                <Button variant="light" type="button">
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
