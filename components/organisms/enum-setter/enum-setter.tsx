import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import Button from "@/components/atoms/buttons/button/button";
import TextInput from "@/components/atoms/form/text-input/text-input";
import useFormHooks from "@/hooks/use-form-hooks";
import { useActionVerificationModalContext } from "@/components/contexts/action-verification-modal-context/action-verification-modal-context";
import { deleteDoc, setCollection, updateDoc } from "@/helpers/firebase";
import { EnumItem } from "@/types/firebase-types";

export type Item = {
  label: string;
  id: string;
};

type EnumSetterProps = {
  items: Item[];
  addLabel?: string;
  confirmationTitle?: string;
  confirmationMessage?: string;
  collectionId: string;
};

const EnumSetter = <T extends EnumItem>({
  items,
  addLabel = "Add Item",
  confirmationTitle,
  confirmationMessage,
  collectionId,
}: EnumSetterProps) => {
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

  const { setActionVerification, closeActionVerification } =
    useActionVerificationModalContext();

  useEffect(() => {
    setRequiredFields(items.map((item) => item.id));
  }, [items]);

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
    reset,
  } = useFormHooks({
    requiredFields,
    initialize: () => initialData,
    onSubmit: async () => {
      // Handle your form submission logic here
      console.log(values);
      console.log("Required Fields:", requiredFields);
      const data = Object.keys(values).map((key) => ({
        id: key,
        label: values[key],
      }));
      const submit = async () => {
        await saveChanges(data);
        // blur all inputs
        Object.keys(values).forEach((id) => {
          document.getElementById(id)?.blur();
        });
      };
      const onClose = () => {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
        closeActionVerification();
      };

      if (confirmationTitle && confirmationMessage) {
        setActionVerification({
          onClose: onClose,
          isOpen: true,
          title: confirmationTitle,
          message: confirmationMessage,
          buttons: [
            {
              label: "Save",
              onClick: async () => {
                await submit();
                closeActionVerification();
              },
              variant: "primary",
              handleLoading: true,
            },
            {
              label: "Cancel",
              onClick: onClose,
              variant: "ghost",
            },
          ],
        });
      } else {
        await submit();
      }
    },
  });

  useEffect(() => {
    reset();
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveChanges = async (changedItems: Item[]) => {
    // array of items that already exist
    const existingItems = changedItems.filter((changedItem) =>
      items?.find((item) => item.id === changedItem.id),
    );
    // array of items that are new
    const newItems = changedItems.filter(
      (changedItem) => !items?.find((item) => item.id === changedItem.id),
    );
    // array of items that have been removed
    const removedIds = items
      .map((item) => item.id)
      .filter(
        (id) => !changedItems.find((changedItem) => changedItem.id === id),
      );

    // update existing items
    await Promise.all(
      existingItems.map((item) =>
        updateDoc<T>({
          collectionId: collectionId,
          docId: item.id,
          data: { name: item.label } as T,
        }),
      ),
    );
    // add new items
    await setCollection<T>({
      collectionId: collectionId,
      data: newItems.map(
        (item) =>
          ({
            id: item.id,
            name: item.label,
          }) as T,
      ),
    });
    // remove removed items
    await Promise.all(
      removedIds.map((id) =>
        deleteDoc({ collectionId: collectionId, docId: id }),
      ),
    );
  };

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

  const removeField = (id: string) => {
    setRequiredFields((fields) => fields.filter((field) => field !== id));
    setFormState((state) => {
      const { [id]: _, ...newValues } = state.values;
      return { ...state, values: newValues, isDirty: true };
    });
  };

  return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <table className="table">
        <tbody>
          {Object.keys(values)
            .sort((a, b) =>
              (initialData[a] || "zzz").localeCompare(initialData[b] || "zzz"),
            )
            .map((id, i) => (
              <tr key={id} className="">
                <td className="py-1 px-0 relative">
                  <TextInput
                    id={id}
                    name={id}
                    className="pr-14 input-sm text-base-content"
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
                      onClick={() => removeField(id)}
                      type="button"
                    >
                      <TrashIcon className="w-4 h-4 text-base-content" />
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
          className="w-full justify-start text-base-content"
          onClick={addNewField}
          type="button"
        >
          <PlusIcon className="w-5 h-5" /> {addLabel}
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
  );
};

export default EnumSetter;
