import Modal from '@/components/atoms/modal/modal';
import useFormHooks from '@/hooks/use-form-hooks';
import React, { ReactNode, useMemo } from 'react';
import { FormErrors } from '@/hooks/use-form-validation';
import InputGroup from '@/components/atoms/form/input-group/input-group';
import { DatePicker } from '@tremor/react';
import { createTextChangeEvent } from '@/helpers/forms';
import Button from '@/components/atoms/button/button';
import { setDoc } from '@/helpers/firebase';
import { getEndDateFromStartDate } from '@/helpers/utils';

type AddDayModalProps = {
	isOpen: boolean,
  onClose: () => void,
  weekStartDate: Date,
  weekId: string,
};

interface AddDayData {
  date: string | undefined,
}

const AddDayModal: React.FC<Readonly<AddDayModalProps>> = ({ isOpen, onClose, weekStartDate, weekId }) => {
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
      const result = await setDoc({
        collectionId: `weeks/${weekId}/days`,
        data: {
          date: values.date,
          weekId
        }
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
    }
  })
  
  return <Modal
    title="Add Day"
    isOpen={isOpen}
    onClose={onClose}
  >
    <form method="post" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <div>
          <InputGroup
            label="Date"
            error={!!errorMessages?.date}
            errorMessage={errorMessages?.date}
          >
            <DatePicker
              value={values.date === undefined ? undefined : new Date(parseInt(values.date))}
              onValueChange={(value) => handleChange(createTextChangeEvent(value ? value.getTime().toString() : undefined, "date"))}
              minDate={weekStartDate}
              maxDate={weekEndDate}
            />
          </InputGroup>
        </div>
        <div>
          <Button
            loading={isSubmitting}
            disabled={showDisabled}
            className="w-full"
          >
            Save
          </Button>
          {showSubmitError && (
            <div className="label">
              <span className="label-text-alt text-error">{submitError ? submitError[0] : ''}</span>
            </div>
          )}
        </div>
      </div>
    </form>
  </Modal>
};

export default AddDayModal;
