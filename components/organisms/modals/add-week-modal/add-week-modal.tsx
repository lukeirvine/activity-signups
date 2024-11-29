import { DatePicker } from "@tremor/react";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import TextInput from "@/components/atoms/form/text-input/text-input";
import Modal from "@/components/atoms/modal/modal";
import { setDoc, updateDoc } from "@/helpers/firebase";
import { createTextChangeEvent } from "@/helpers/forms";
import useFormHooks from "@/hooks/use-form-hooks";
import { FormError, FormErrors } from "@/hooks/use-form-validation";

import "react-datepicker/dist/react-datepicker.css";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import { Week } from "@/types/firebase-types";

type MyComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  week?: Week | null;
};

interface AddWeekData {
  name: string;
  startDate: string | undefined;
}

const customValidate = ({
  values,
}: {
  values: AddWeekData;
}): FormErrors<AddWeekData> => {
  let errors: FormErrors<AddWeekData> = {};

  const startDate = new Date(values.startDate || "");
  // make sure startDate is a sunday at midnight
  if (
    startDate.getDay() !== 0 ||
    startDate.getHours() !== 0 ||
    startDate.getMinutes() !== 0
  ) {
    const error: FormError = {
      type: "custom",
      message: "Start date must be a Sunday",
    };
    errors.startDate = error;
  }

  return errors;
};

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({
  isOpen,
  onClose,
  week,
}) => {
  const router = useRouter();
  const requiredFields: (keyof AddWeekData)[] = useMemo(() => {
    return ["name", "startDate"];
  }, []);
  const formData: AddWeekData = {
    name: week?.name || "",
    startDate: week?.startDate,
  };
  const {
    values,
    handleChange,
    handleSubmit,
    setFormState,
    errorMessages,
    isSubmitting,
    showDisabled,
    showSubmitError,
    submitError,
    reset,
  } = useFormHooks({
    requiredFields,
    initialize: () => formData,
    onValidate: customValidate,
    onSubmit: async () => {
      const data = {
        collectionId: "weeks",
        data: {
          name: values.name,
          startDate: values.startDate || "",
        },
      };
      const result = week?.id
        ? await updateDoc<Week>({ ...data, docId: week.id })
        : await setDoc<Week>(data);
      if (!result.success) {
        setFormState((state) => ({
          ...state,
          submitError: [result.error || "Error saving week."],
          isSubmitting: false,
          values: {
            name: "",
            startDate: undefined,
          },
        }));
      } else {
        reset();
        onClose();
        if (result.uid) router.push(`/weeks/${result.uid}`);
      }
    },
  });

  useEffect(() => {
    console.log("Incoming Week changed", week);
    setFormState((prev) => ({
      ...prev,
      values: {
        startDate: week?.startDate,
        name: week?.name || "",
      },
    }));
  }, [week, setFormState, isOpen]);

  return (
    <Modal
      // id="add_week_modal"
      title="Add Week"
      isOpen={isOpen}
      onClose={onClose}
    >
      <BasicForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showDisabled={showDisabled}
        showSubmitError={showSubmitError}
        submitError={submitError}
      >
        <InputGroup
          label="Start Date"
          error={!!errorMessages?.startDate}
          errorMessage={errorMessages?.startDate}
        >
          <DatePicker
            value={
              values.startDate === undefined
                ? undefined
                : new Date(values.startDate)
            }
            onValueChange={(value) =>
              handleChange(
                createTextChangeEvent(
                  value ? value.toISOString() : undefined,
                  "startDate",
                ),
              )
            }
          />
        </InputGroup>
        <InputGroup
          label="Week Name"
          error={!!errorMessages?.name}
          errorMessage={errorMessages?.name}
        >
          <TextInput
            id="name"
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            error={!!errorMessages?.name}
          />
        </InputGroup>
      </BasicForm>
    </Modal>
  );
};

export default AddWeekModal;
