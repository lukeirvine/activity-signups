import Button from '@/components/atoms/button/button';
import InputGroup from '@/components/atoms/form/input-group/input-group';
import TextInput from '@/components/atoms/form/text-input/text-input';
import Modal from '@/components/atoms/modal/modal';
import { setDoc } from '@/helpers/firebase';
import { createTextChangeEvent } from '@/helpers/forms';
import useFormHooks from '@/hooks/use-form-hooks';
import { DatePicker, DatePickerValue } from '@tremor/react';
import { FormError, FormErrors } from '@/hooks/use-form-validation';
import React, { ReactNode, useEffect, useMemo } from 'react';

import "react-datepicker/dist/react-datepicker.css";
import BasicForm from '@/components/molecules/basic-form/basic-form';

type MyComponentProps = {
	isOpen: boolean,
	onClose: () => void,
};

interface AddWeekData {
	name: string,
	startDate: string | undefined,
}

const customValidate = ({
	values,
}: {
	values: AddWeekData;
}): FormErrors<AddWeekData> => {
	let errors: FormErrors<AddWeekData> = {};

	const startDate = new Date(parseInt(values.startDate || ""));
	// make sure startDate is a sunday at midnight
	if (startDate.getDay() !== 0 || startDate.getHours() !== 0 || startDate.getMinutes() !== 0) {
		const error: FormError = {
			type: "custom",
			message: "Start date must be a Sunday",
		};
		errors.startDate = error;
	}

	return errors;
}

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({ isOpen, onClose }) => {
	const requiredFields: (keyof AddWeekData)[] = useMemo(() => {
		return ["name", "startDate"];
	}, []);
	const formData: AddWeekData = {
		name: "",
		startDate: undefined,
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
			const result = await setDoc({
				collectionId: "weeks",
				data: {
					name: values.name,
					startDate: values.startDate,
				},
			});
			if (!result.success) {
				setFormState((state) => ({
					...state,
					submitError: [result.error || "Error saving week."],
					isSubmitting: false,
				}));
			} else {
				reset();
				onClose();
			}
		}
	});
	
	return <Modal
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
					value={values.startDate === undefined ? undefined : new Date(parseInt(values.startDate))}
					onValueChange={(value) => handleChange(createTextChangeEvent(value ? value.getTime().toString() : undefined, "startDate"))}
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
		</BasicForm>
	</Modal>;
};

export default AddWeekModal;
