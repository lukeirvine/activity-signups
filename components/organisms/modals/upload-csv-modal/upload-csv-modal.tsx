import InputGroup from '@/components/atoms/form/input-group/input-group';
import Modal from '@/components/atoms/modal/modal';
import BasicForm from '@/components/molecules/basic-form/basic-form';
import { setDoc } from '@/helpers/firebase';
import useFormHooks from '@/hooks/use-form-hooks';
import { useParams } from 'next/navigation';
import { FormErrors } from '@/hooks/use-form-validation';
import React, { ReactNode, useMemo } from 'react';
import { parseCsvToActivity } from '@/helpers/csv';

type UploadCSVModalProps = {
	isOpen: boolean,
  onClose: () => void,
};

interface UploadData {
  file: File | undefined,
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
}

const UploadCSVModal: React.FC<Readonly<UploadCSVModalProps>> = ({ isOpen, onClose }) => {
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
      if (file) {
        const activity = parseCsvToActivity(file, weekId, dayId);
        console.log("ACTIVITY", activity);
      }
    }
  })
  
  return <Modal
    title="Upload CSV"
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
        label="CSV File"
        error={!!errorMessages?.file}
        errorMessage={errorMessages?.file}
      >
        <input
          type="file"
          name="file"
          className="file-input input-bordered w-full"
          onChange={handleChange}
          accept=".csv"
        />
      </InputGroup>
    </BasicForm>
  </Modal>
};

export default UploadCSVModal;
