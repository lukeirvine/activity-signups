import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import InputGroup from "@/components/atoms/form/input-group/input-group";
import Modal from "@/components/atoms/modal/modal";
import BasicForm from "@/components/molecules/basic-form/basic-form";
import useFormHooks from "@/hooks/use-form-hooks";
import { FormErrors } from "@/hooks/use-form-validation";
import { parseCsvToActivity } from "@/helpers/csv";
import { setCollection } from "@/helpers/firebase";
import { Activity } from "@/types/firebase-types";

type UploadCSVModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface UploadData {
  file: File | undefined;
}

const customValidate = ({
  values,
}: {
  values: UploadData;
}): FormErrors<UploadData> => {
  let errors: FormErrors<UploadData> = {};

  if (!values.file) {
    errors.file = {
      type: "required",
      message: "File is required",
    };
  }

  return errors;
};

const UploadCSVModal: React.FC<Readonly<UploadCSVModalProps>> = ({
  isOpen,
  onClose,
}) => {
  const params = useParams();
  const { weekid, dayid } = params;
  const weekId = typeof weekid === "string" ? weekid : weekid[0];
  const dayId = typeof dayid === "string" ? dayid : dayid[0];

  const requiredFields: (keyof UploadData)[] = useMemo(() => {
    return ["file"];
  }, []);
  const formData: UploadData = {
    file: undefined,
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
      const file = values.file;
      console.log("FILE", file, typeof file);
      if (file) {
        const activities = await parseCsvToActivity(file, weekId, dayId);
        console.log("ACTIVITY", activities);
        const result = await setCollection<Activity>({
          collectionId: `weeks/${weekId}/days/${dayId}/activities`,
          data: activities,
        });
        if (!result.success) {
          setFormState((state) => ({
            ...state,
            submitError: [result.error || "Error saving activities."],
            isSubmitting: false,
          }));
        } else {
          reset();
          onClose();
        }
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormState((prevState) => ({
        ...prevState,
        values: {
          ...prevState.values,
          file: file,
        },
      }));
    }
  };

  return (
    <Modal title="Upload CSV" isOpen={isOpen} onClose={onClose}>
      <div className="prose">
        <p className="text-warning">
          This will overwrite any activities on this day.
        </p>
      </div>
      <BasicForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showDisabled={showDisabled}
        showSubmitError={showSubmitError}
        submitError={submitError}
      >
        <InputGroup
          label="CSV File"
          error={!!errorMessages?.file}
          errorMessage={errorMessages?.file}
        >
          <input
            type="file"
            name="file"
            className="file-input input-bordered w-full"
            onChange={handleFileChange}
            accept=".csv"
          />
        </InputGroup>
      </BasicForm>
    </Modal>
  );
};

export default UploadCSVModal;
