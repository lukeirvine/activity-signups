import TextInput from '@/components/atoms/form/text-input/text-input';
import Modal from '@/components/atoms/modal/modal';
import useFormHooks from '@/hooks/use-form-hooks';
import { DatePicker } from '@tremor/react';
import React, { ReactNode, useMemo } from 'react';

import "react-datepicker/dist/react-datepicker.css";

type MyComponentProps = {
	id: string;
};

interface AddWeekData {
	name: string,
	startDate: Date,
}

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({ id }) => {
	const requiredFields: (keyof AddWeekData)[] = useMemo(() => {
		return ["name", "startDate"];
	}, []);
	const formData: AddWeekData = {
		name: "",
		startDate: new Date(),
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
	} = useFormHooks({
		requiredFields,
		initialize: () => formData,
		onSubmit: async () => {

		}
	})
	
	return <Modal
		id="add_week_modal"
		title="Add Week"
	>
		<form method="post" onSubmit={handleSubmit} noValidate>
			<TextInput
				id="name"
				name="name"
				label="Name"
				placeholder="Junior Camp"
				value={values.name}
				onChange={handleChange}
				error={!!errorMessages?.name}
				errorMessage={errorMessages?.name}
			/>
			<DatePicker />
		</form>
	</Modal>;
};

export default AddWeekModal;
