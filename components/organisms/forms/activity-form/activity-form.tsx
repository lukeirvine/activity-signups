import React, { useEffect, useMemo } from "react";
import uuid from "react-uuid";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import Select from "@/components/atoms/form/select/select";
import TextInput from "@/components/atoms/form/text-input/text-input";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import { updateDoc } from "@/helpers/firebase";
import { useListenCollection } from "@/hooks/use-firebase";
import useFormHooks from "@/hooks/use-form-hooks";
import { Activity, Department } from "@/types/firebase-types";

interface ActivityData {
  name: string;
  cost: string;
  highlightedText: string;
  department: string;
  headcount: number;
  secondaryHeadcountName: string;
  secondaryHeadcount: number;
  notes: string;
}

type ActivityFormProps = {
  activity: Activity;
};

const ActivityForm: React.FC<Readonly<ActivityFormProps>> = ({ activity }) => {
  const { docs: departments } = useListenCollection<Department>({
    collectionId: "departments",
  });

  const requiredFields: (keyof ActivityData)[] = useMemo(() => {
    return ["name", "department", "headcount"];
  }, []);
  const formData: ActivityData = {
    name: activity.name,
    cost: activity.cost,
    highlightedText: activity.highlightedText,
    department: activity.department,
    headcount: activity.headcount,
    secondaryHeadcountName: activity.secondaryHeadcountName,
    secondaryHeadcount: activity.secondaryHeadcount,
    notes: activity.notes.join("\n"),
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
    isDirty,
  } = useFormHooks({
    requiredFields,
    initialize: () => formData,
    onSubmit: async () => {
      // convert notes to array
      const notes = values.notes.split("\n");
      const newId = uuid();
      await updateDoc({
        collectionId: "activities",
        docId: activity.id || newId,
        data: {
          name: values.name,
          cost: values.cost || "",
          highlightedText: values.highlightedText || "",
          department: values.department,
          headcount: values.headcount,
          secondaryHeadcountName: values.secondaryHeadcountName || "",
          secondaryHeadcount: values.secondaryHeadcount
            ? values.secondaryHeadcount
            : 0,
          notes: notes || [""],
          timeUpdated: new Date().toISOString(),
        },
      });
    },
  });

  useEffect(() => {
    const firstInput = document.getElementById("name") as HTMLInputElement;
    if (firstInput && firstInput.value === "New Activity") {
      firstInput.focus();
      firstInput.select();
    }
  }, []);

  useEffect(() => {
    reset();
  }, [activity]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BasicForm
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      showDisabled={showDisabled}
      showSubmitError={showSubmitError}
      submitError={submitError}
      buttonVariant="minimal"
      isDirty={isDirty}
    >
      <InputGroup
        label="Activity Name"
        error={!!errorMessages?.name}
        errorMessage={errorMessages?.name}
        variant="inline"
      >
        <TextInput
          id="name"
          name="name"
          placeholder="Enter value"
          value={values.name}
          onChange={handleChange}
          error={!!errorMessages?.name}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Cost"
        error={!!errorMessages?.cost}
        errorMessage={errorMessages?.cost}
        variant="inline"
        tooltip="String format like '$10' or '$10-$20'"
      >
        <TextInput
          id="cost"
          name="cost"
          placeholder="Enter value"
          value={values.cost}
          onChange={handleChange}
          error={!!errorMessages?.cost}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Highlighted Text"
        error={!!errorMessages?.highlightedText}
        errorMessage={errorMessages?.highlightedText}
        variant="inline"
      >
        <TextInput
          id="highlightedText"
          name="highlightedText"
          placeholder="Enter value"
          value={values.highlightedText}
          onChange={handleChange}
          error={!!errorMessages?.highlightedText}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Department"
        error={!!errorMessages?.department}
        errorMessage={errorMessages?.department}
        variant="inline"
      >
        {departments && (
          <Select
            id="department"
            name="department"
            value={values.department}
            onChange={handleChange}
            error={!!errorMessages?.department}
            variant="ghost"
          >
            <option value="">Select Department</option>
            {Object.keys(departments)
              .sort((a, b) =>
                departments[a].name.localeCompare(departments[b].name),
              )
              .map((key) => {
                return (
                  <option key={key} value={key}>
                    {departments[key].name}
                  </option>
                );
              })}
          </Select>
        )}
        {departments === null && <div className="skeleton w-full h-10"></div>}
      </InputGroup>
      <InputGroup
        label="Headcount"
        error={!!errorMessages?.headcount}
        errorMessage={errorMessages?.headcount}
        variant="inline"
      >
        <TextInput
          id="headcount"
          name="headcount"
          type="number"
          placeholder="Enter value"
          value={values.headcount}
          onChange={handleChange}
          error={!!errorMessages?.headcount}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Secondary Headcount Name"
        error={!!errorMessages?.secondaryHeadcountName}
        errorMessage={errorMessages?.secondaryHeadcountName}
        variant="inline"
      >
        <TextInput
          id="secondaryHeadcountName"
          name="secondaryHeadcountName"
          placeholder="Enter value"
          value={values.secondaryHeadcountName}
          onChange={handleChange}
          error={!!errorMessages?.secondaryHeadcountName}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Secondary Headcount"
        error={!!errorMessages?.secondaryHeadcount}
        errorMessage={errorMessages?.secondaryHeadcount}
        variant="inline"
      >
        <TextInput
          id="secondaryHeadcount"
          name="secondaryHeadcount"
          type="number"
          placeholder="Enter value"
          value={values.secondaryHeadcount}
          onChange={handleChange}
          error={!!errorMessages?.secondaryHeadcount}
          variant="ghost"
        />
      </InputGroup>
      <InputGroup
        label="Notes"
        error={!!errorMessages?.notes}
        errorMessage={errorMessages?.notes}
      >
        <textarea
          id="notes"
          name="notes"
          placeholder="Enter value"
          value={values.notes}
          onChange={handleChange}
          className="textarea px-3 text-sm w-full textarea-bordered"
          // how many lines of text shown
          rows={4}
        />
      </InputGroup>
    </BasicForm>
  );
};

export default ActivityForm;
