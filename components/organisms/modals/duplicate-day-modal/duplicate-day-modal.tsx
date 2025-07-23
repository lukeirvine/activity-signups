import React, { useMemo } from "react";
import { DatePicker } from "@tremor/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/atoms/modal/modal";
import useFormHooks from "@/hooks/use-form-hooks";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import { createTextChangeEvent } from "@/helpers/forms";
import { getEndDateFromStartDate } from "@/helpers/utils";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import { Week } from "@/types/firebase-types";
import Select from "@/components/atoms/form/select/select";
import { useListenCollection } from "@/hooks/use-firebase";

type DuplicateDayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  dayId: string;
};

interface DuplicateDayData {
  week: string | undefined;
  date: string | undefined;
}

const DuplicateDayModal: React.FC<Readonly<DuplicateDayModalProps>> = ({
  isOpen,
  onClose,
  weekId,
  dayId,
}) => {
  const router = useRouter();

  const { docs: weeks, loading: weeksLoading } = useListenCollection<Week>({
    collectionId: `weeks`,
  });

  const requiredFields: (keyof DuplicateDayData)[] = useMemo(() => {
    return ["week", "date"];
  }, []);
  const formData: DuplicateDayData = {
    week: undefined,
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
      // const result = await setDoc<Day>({
      //   collectionId: `weeks/${weekId}/days`,
      //   data: {
      //     date: values.date || "",
      //     weekId,
      //   },
      // });
      // if (!result.success) {
      //   setFormState((state) => ({
      //     ...state,
      //     submitError: [result.error || "Error saving day."],
      //     isSubmitting: false,
      //   }));
      // } else {
      //   reset();
      //   onClose();
      //   if (result.uid) router.push(`/weeks/${weekId}/${result.uid}`);
      // }
    },
  });

  return (
    <Modal title="Duplicate Day" isOpen={isOpen} onClose={onClose}>
      <div className="text-base-content">Select target week and date.</div>
      <BasicForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showDisabled={showDisabled}
        showSubmitError={showSubmitError}
        submitError={submitError}
      >
        {weeks === null && <div className="skeleton w-full h-10"></div>}
        {weeks && (
          <>
            <InputGroup
              label="Week"
              error={!!errorMessages?.week}
              errorMessage={errorMessages?.week}
            >
              <Select
                name="week"
                value={values.week || ""}
                onChange={handleChange}
              >
                <option value="">Select a week</option>
                {Object.values(weeks)
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.name} (
                      {new Date(week.startDate).toLocaleDateString()} -{" "}
                      {getEndDateFromStartDate(
                        new Date(week.startDate),
                      ).toLocaleDateString()}
                      )
                    </option>
                  ))}
              </Select>
            </InputGroup>
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
                minDate={new Date(weeks[values.week || ""]?.startDate)}
                maxDate={getEndDateFromStartDate(
                  new Date(weeks[values.week || ""]?.startDate),
                )}
                disabled={!weeks[values.week || ""]}
              />
            </InputGroup>
          </>
        )}
      </BasicForm>
    </Modal>
  );
};

export default DuplicateDayModal;
