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
import { ActivitySet, Week } from "@/types/firebase-types";
import Select from "@/components/atoms/form/select/select";
import { useReadCollection } from "@/hooks/use-firebase";

type MyComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  week?: Week | null;
};

interface AddWeekData {
  name: string;
  startDate: string | undefined;
  activitySetId: string | undefined;
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

  const { docs: activitySets } = useReadCollection<ActivitySet>({
    collectionId: "activity-sets",
  });

  const requiredFields: (keyof AddWeekData)[] = useMemo(() => {
    return ["name", "startDate", "activitySetId"];
  }, []);
  const formData: AddWeekData = {
    name: week?.name || "",
    startDate: week?.startDate,
    activitySetId: week?.activitySetId || "",
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
          activitySetId: values.activitySetId || "",
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
            activitySetId: undefined,
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
    setFormState((prev) => ({
      ...prev,
      values: {
        startDate: week?.startDate,
        name: week?.name || "",
        activitySetId: week?.activitySetId || "",
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
        <InputGroup
          label="Activity Set"
          error={!!errorMessages?.activitySetId}
          errorMessage={errorMessages?.activitySetId}
        >
          {activitySets && (
            <Select
              name="activitySetId"
              value={values.activitySetId || ""}
              onChange={handleChange}
              error={!!errorMessages?.activitySetId}
              disabled={(week?.activitySetId?.length ?? 0) > 0}
            >
              <option value="" disabled>
                Select an Activity Set
              </option>
              {Object.values(activitySets).map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </Select>
          )}
          {!activitySets && <div className="w-full h-12 skeleton"></div>}
        </InputGroup>
      </BasicForm>
    </Modal>
  );
};

export default AddWeekModal;
