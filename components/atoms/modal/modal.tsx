"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import CardTitle from "../text/card-title/card-title";

type Variant = "narrow" | "default";

type VariantStyles = {
  container: string;
};

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  variant?: Variant;
  title?: string;
};

const Modal: React.FC<Readonly<ModalProps>> = ({
  children,
  isOpen,
  onClose,
  variant = "default",
  title,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = async () => {
    // close internally
    setOpen(false);
    // wait for modal to close
    await new Promise((resolve) => setTimeout(resolve, 300));
    // call parent close
    onClose();
  };

  const variantStyles: Record<Variant, VariantStyles> = {
    narrow: {
      container: "sm:w-[350px] p-10 sm:p-6",
    },
    default: {
      container: "sm:w-[600px] p-10 lg:p-14",
    },
  };

  const containerStyle =
    "bg-tremor-background dark:bg-dark-tremor-background border-tremor-border dark:border-dark-tremor-border shadow-tremor-card dark:shadow-dark-tremor-card";

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-neutral bg-opacity-60"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 w-screen overflow-y-auto">
          {/* Container to center the panel */}
          <div className="flex flex-col sm:flex-row overflow-scroll h-full sm:min-h-full sm:h-auto items-center justify-start sm:justify-center sm:py-24">
            {/* This div locks the starting margin of the modal from the top */}
            <div className="sm:hidden w-full h-1/6 flex-none" />
            {/* This div forces the top of the modal towards the bottom of the page if it isn't tall enough to reach the div above */}
            <div className="sm:hidden w-full h-3/6" />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom={`opacity-0 ${isSmallScreen ? "translate-y-1/2" : "scale-95"}`}
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo={`opacity-0 ${isSmallScreen ? "translate-y-1/2" : "scale-95"}`}
            >
              {/* The actual dialog panel */}
              <Dialog.Panel
                className={`flex-grow sm:flex-none relative sm:bottom-auto w-full mx-auto rounded-t-lg sm:rounded-tremor-default ${containerStyle} ${variantStyles[variant].container}`}
              >
                {title && (
                  <Dialog.Title>
                    <CardTitle>{title}</CardTitle>
                  </Dialog.Title>
                )}
                {children}
                <div className="absolute right-5 top-5 lg:right-4 lg:top-4">
                  <button
                    onClick={handleClose}
                    className="text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                  >
                    {/* <IconXBold color="text-base-100-content" /> */}
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
