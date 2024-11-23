import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/atoms/buttons/button/button";
import Card from "@/components/atoms/containers/card/card";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import TextInput from "@/components/atoms/form/text-input/text-input";
import { createTextChangeEvent } from "@/helpers/forms";
import useFormHooks from "@/hooks/use-form-hooks";
import { FormErrors } from "@/hooks/use-form-validation";
import { Activities, Activity, Occurrence } from "@/types/firebase-types";
import { setDoc } from "@/helpers/firebase";

type FormData = {
  period: string;
  id: string;
};

type CreateOccurrenceFormProps = {
  activities: Activities;
};

const customValidate = ({
  values,
}: {
  values: FormData;
}): FormErrors<FormData> => {
  let errors: FormErrors<FormData> = {};

  let period = values.period.replace(/\s+/g, "");
  if (!period.match(/^([0-6](,[0-6])*)?$/)) {
    errors.period = {
      type: "custom",
      message:
        "Period must be a comma separated list of sequential numbers between 0 and 6",
    };
  } else {
    const periodArray = period.split(",").map(Number);
    const uniquePeriods = new Set(periodArray);
    if (uniquePeriods.size !== periodArray.length) {
      errors.period = {
        type: "custom",
        message: "Period must not contain duplicate numbers",
      };
    } else {
      for (let i = 1; i < periodArray.length; i++) {
        if (periodArray[i] !== periodArray[i - 1] + 1) {
          errors.period = {
            type: "custom",
            message: "Period must be a sequential list of numbers",
          };
          break;
        }
      }
    }
  }

  return errors;
};

const CreateOccurrenceForm: React.FC<Readonly<CreateOccurrenceFormProps>> = ({
  activities,
}) => {
  const params = useParams();
  const { weekid, dayid } = params;
  const weekId = typeof weekid === "string" ? weekid : weekid[0];
  const dayId = typeof dayid === "string" ? dayid : dayid[0];

  const requiredFields: (keyof FormData)[] = useMemo(() => {
    return ["period", "id"];
  }, []);
  const formData: FormData = {
    period: "",
    id: "",
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
      const periods = values.period.split(",").map(Number);
      await setDoc<Occurrence>({
        collectionId: `weeks/${weekId}/days/${dayId}/occurrences`,
        data: {
          activityId: values.id,
          period: periods,
          dayId,
          weekId,
          timeCreated: new Date().toISOString(),
          timeUpdated: new Date().toISOString(),
        },
      });
      setFormState((state) => ({
        ...state,
        values: {
          ...state.values,
          id: "",
        },
        isSubmitting: false,
        isDirty: false,
        hasSubmitted: false,
        hasErrors: false,
      }));
      setSearchVal("");
      document.getElementById("id")?.focus();
    },
  });

  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState<Activity[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (e.target.value.length > 0) {
      const results = Object.values(activities).filter((activity) =>
        activity.name.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      // save first 5 results
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
    handleChange(createTextChangeEvent("", "id"));
  };

  const handleSearchSelect = (activity: Activity) => {
    setSearchVal(activity.name);
    handleChange(createTextChangeEvent(activity.id, "id"));
    setSearchResults([]);
  };

  return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2 items-center">
        <InputGroup label="Period">
          <TextInput
            name="period"
            type="text"
            value={values.period}
            onChange={handleChange}
            placeholder="--"
            error={!!errorMessages?.period}
            className="input-sm w-[3.5rem]"
          />
        </InputGroup>
        <InputGroup label="Activity">
          <div className="relative">
            <TextInput
              id="id"
              name="id"
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              placeholder="Activity"
              error={!!errorMessages?.id}
              className="input-sm"
              autoComplete="off"
            />
            {searchResults.length > 0 && (
              <Card className="absolute w-64 top-10 z-10" padding="thin">
                <ul className="menu menu-sm">
                  {searchResults.map((activity) => (
                    <li key={activity.id} className="">
                      <button
                        type="button"
                        onClick={() => handleSearchSelect(activity)}
                      >
                        {activity.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </InputGroup>
        <Button
          loading={isSubmitting}
          disabled={showDisabled}
          type="submit"
          className="btn-sm relative top-[1.125rem]"
        >
          Add
        </Button>
      </div>
      {errorMessages?.period && (
        <div className="label text-error text-sm">{errorMessages.period}</div>
      )}
      {errorMessages?.id && !errorMessages?.period && (
        <div className="label text-error text-sm">{errorMessages.id}</div>
      )}
    </form>
  );
};

export default CreateOccurrenceForm;
