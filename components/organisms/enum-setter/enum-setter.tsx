import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import uuid from "react-uuid";
import Button from "@/components/atoms/buttons/button/button";
import Card from "@/components/atoms/containers/card/card";
import TextInput from "@/components/atoms/form/text-input/text-input";
import useFormHooks from "@/hooks/use-form-hooks";

type Item = {
  label: string;
  id: string;
};

type EnumSetterProps = {
  items: Item[];
};

const EnumSetter: React.FC<Readonly<EnumSetterProps>> = ({ items }) => {
  const initialData = items.reduce(
    (acc, item) => {
      acc[item.id] = item.label;
      return acc;
    },
    {} as { [key: string]: string },
  );
  const [requiredFields, setRequiredFields] = useState(
    items.map((item) => item.id),
  );

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
    isDirty,
  } = useFormHooks({
    requiredFields,
    initialize: () => initialData,
    onSubmit: async () => {
      // Handle your form submission logic here
      console.log(values);
    },
  });

  const addNewField = async () => {
    const newId = uuid();
    setRequiredFields((fields) => [...fields, newId]);
    setFormState((state) => ({
      ...state,
      values: {
        ...state.values,
        [newId]: "",
      },
    }));
    // wait 100ms for the new input to render
    await new Promise((resolve) => setTimeout(resolve, 100));
    document.getElementById(newId)?.focus();
  };

  return (
    <Card className="w-full max-w-96">
      <form method="post" onSubmit={handleSubmit} noValidate>
        <table className="table">
          <tbody>
            {Object.keys(values).map((id, i) => (
              <tr key={id} className="">
                <td className="py-1 px-0 relative">
                  <TextInput
                    id={id}
                    name={id}
                    className="pr-14"
                    placeholder="Enter value"
                    value={values[id]}
                    onChange={handleChange}
                    error={!!errorMessages?.[id]}
                    variant="table"
                  />
                  <div className="absolute top-0 h-full w-full px-2 flex justify-end items-center pointer-events-none">
                    <Button
                      variant="ghost"
                      className="btn-sm pointer-events-auto"
                      onClick={() => {
                        setRequiredFields((fields) =>
                          fields.filter((field) => field !== id),
                        );
                        setFormState((state) => {
                          const { [id]: _, ...newValues } = state.values;
                          return { ...state, values: newValues, isDirty: true };
                        });
                      }}
                      type="button"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={addNewField}
            type="button"
          >
            <PlusIcon className="w-5 h-5" /> Add Department
          </Button>
          {isDirty && (
            <div className="flex">
              <Button
                loading={isSubmitting}
                disabled={showDisabled || !isDirty}
                className="btn-sm"
              >
                Save
              </Button>
            </div>
          )}
        </div>
        {showSubmitError && (
          <div className="label">
            <span className="label-text-alt text-error">
              {submitError ? submitError[0] : ""}
            </span>
          </div>
        )}
      </form>
    </Card>
  );
};

export default EnumSetter;
