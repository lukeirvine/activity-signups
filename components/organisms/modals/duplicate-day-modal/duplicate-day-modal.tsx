import React, { useMemo } from "react";
import { DatePicker } from "@tremor/react";
import { useRouter } from "next/navigation";
import uuid from "react-uuid";
import Modal from "@/components/atoms/modal/modal";
import useFormHooks from "@/hooks/use-form-hooks";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import { createTextChangeEvent } from "@/helpers/forms";
import { getEndDateFromStartDate } from "@/helpers/utils";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import { Day, Occurrences, Week } from "@/types/firebase-types";
import Select from "@/components/atoms/form/select/select";
import { useCallableFunction, useListenCollection } from "@/hooks/use-firebase";
import {
  DeepDuplicateDayRequest,
  DeepDuplicateDayResponse,
} from "@/types/dto-types";
import { setBatch } from "@/helpers/firebase";

type DuplicateDayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  day: Day;
  occurrences: Occurrences;
};

interface DuplicateDayData {
  week: string | undefined;
  date: string | undefined;
}

const DuplicateDayModal: React.FC<Readonly<DuplicateDayModalProps>> = ({
  isOpen,
  onClose,
  weekId,
  day,
  occurrences,
}) => {
  const router = useRouter();

  const { docs: weeks, loading: weeksLoading } = useListenCollection<Week>({
    collectionId: `weeks`,
  });

  const { callFunction: deepDuplicateDay, loading: isCalling } =
    useCallableFunction<DeepDuplicateDayRequest, DeepDuplicateDayResponse>(
      "deepDuplicateDay",
    );

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
    setSubmitError,
  } = useFormHooks({
    requiredFields,
    initialize: () => formData,
    onSubmit: async () => {
      const newDayId = uuid();
      const dayData: Day = {
        date: values.date || "",
        weekId: values.week || "",
      };
      const data = [
        {
          docId: newDayId,
          collectionPath: `weeks/${values.week}/days`,
          data: dayData,
        },
        ...Object.values(occurrences).map((occurrence) => ({
          collectionPath: `weeks/${values.week}/days/${newDayId}/occurrences`,
          data: occurrence,
        })),
      ];
      const result = await setBatch({ docs: data });
      if (result.success) {
        onClose();
        reset();
      } else {
        setSubmitError([
          `There was an error duplicating the day: ${result.error || ""}`,
        ]);
      }
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
