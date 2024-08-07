import React, { useMemo } from "react";
import { DatePicker } from "@tremor/react";
import Modal from "@/components/atoms/modal/modal";
import useFormHooks from "@/hooks/use-form-hooks";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import { createTextChangeEvent } from "@/helpers/forms";
import { setDoc } from "@/helpers/firebase";
import { getEndDateFromStartDate } from "@/helpers/utils";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import { Day } from "@/types/firebase-types";

type AddDayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weekStartDate: Date;
  weekId: string;
};

interface AddDayData {
  date: string | undefined;
}

const AddDayModal: React.FC<Readonly<AddDayModalProps>> = ({
  isOpen,
  onClose,
  weekStartDate,
  weekId,
}) => {
  const weekEndDate = useMemo(() => {
    return getEndDateFromStartDate(weekStartDate);
  }, [weekStartDate]);

  const requiredFields: (keyof AddDayData)[] = useMemo(() => {
    return ["date"];
  }, []);
  const formData: AddDayData = {
    date: undefined,
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
    onSubmit: async () => {
      const result = await setDoc<Day>({
        collectionId: `weeks/${weekId}/days`,
        data: {
          date: values.date || "",
          weekId,
        },
      });
      if (!result.success) {
        setFormState((state) => ({
          ...state,
          submitError: [result.error || "Error saving day."],
          isSubmitting: false,
        }));
      } else {
        reset();
        onClose();
      }
    },
  });

  return (
    <Modal title="Add Day" isOpen={isOpen} onClose={onClose}>
      <BasicForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showDisabled={showDisabled}
        showSubmitError={showSubmitError}
        submitError={submitError}
      >
        <InputGroup
          label="Date"
          error={!!errorMessages?.date}
          errorMessage={errorMessages?.date}
        >
          <DatePicker
            value={
              values.date === undefined ? undefined : new Date(values.date)
            }
            onValueChange={(value) =>
              handleChange(
                createTextChangeEvent(
                  value ? value.toISOString() : undefined,
                  "date",
                ),
              )
            }
            minDate={weekStartDate}
            maxDate={weekEndDate}
          />
        </InputGroup>
      </BasicForm>
    </Modal>
  );
};

export default AddDayModal;
