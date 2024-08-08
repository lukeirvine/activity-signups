import { Button, ButtonVariant } from "@tremor/react";
import Link from "next/link";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

interface ButtonBaseProps {
  label: string;
  variant?: ButtonVariant;
  handleLoading?: boolean;
}

interface ButtonFuncProps extends ButtonBaseProps {
  onClick: () => void | Promise<void>;
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
  replace?: boolean;
}

export type ButtonProps = ButtonLinkProps | ButtonFuncProps;

function isButtonLinkProps(
  buttonProps: ButtonProps,
): buttonProps is ButtonLinkProps {
  return "href" in buttonProps;
}

type ModalConfirmationMessageProps = {
  message?: string | ReactNode;
  buttons?: ButtonProps[];
};

const ModalConfirmationMessage: React.FC<
  Readonly<ModalConfirmationMessageProps>
> = ({ message, buttons }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (buttons && buttons.length > 0) {
        /**
         * Focusing the first button causes mobile modal animations to not work
         * correctly, so we wait a bit before focusing the first button
         */
        await new Promise((resolve) => setTimeout(resolve, 100));
        const firstButton = document.getElementById("first-button");
        if (firstButton) {
          firstButton.focus();
        }
      }
    })();
  }, [buttons]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col text-center pt-2 gap-2">
        {message && (
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-6">
        {buttons?.map((button, i) => (
          <Fragment key={i}>
            {isButtonLinkProps(button) ? (
              <div className="w-full flex justify-between">
                <Link
                  href={button.href}
                  className="w-full"
                  replace={!!button.replace}
                >
                  <Button
                    className="w-full"
                    variant={button.variant}
                    id={i === 0 ? "first-button" : ""}
                  >
                    {button.label}
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={async () => {
                  if (button.handleLoading) setLoading(true);
                  await button.onClick();
                  if (button.handleLoading) setLoading(false);
                }}
                loading={loading && button.handleLoading}
                disabled={loading && button.handleLoading}
                variant={button.variant}
                id={i === 0 ? "first-button" : ""}
              >
                {button.label}
              </Button>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ModalConfirmationMessage;
