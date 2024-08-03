import InputGroup from '@/components/atoms/form/input-group/input-group';
import TextInput from '@/components/atoms/form/text-input/text-input';
import Modal from '@/components/atoms/headless-modal/headless-modal';
import useFormHooks from '@/hooks/use-form-hooks';
import { DatePicker } from '@tremor/react';
import React, { ReactNode, useMemo } from 'react';

import "react-datepicker/dist/react-datepicker.css";

type MyComponentProps = {
	isOpen: boolean,
	onClose: () => void,
};

interface AddWeekData {
	name: string,
	startDate: Date,
}

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({ isOpen, onClose }) => {
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
		// id="add_week_modal"
		// title="Add Week"
		isOpen={isOpen}
		onClose={onClose}
	>
		<form method="post" onSubmit={handleSubmit} noValidate>
			<div className="flex flex-col gap-2 mt-2 mb-8">
				<InputGroup
					label="Start Date"
					error={!!errorMessages?.startDate}
					errorMessage={errorMessages?.startDate}
				>
					<DatePicker />
				</InputGroup>
				<InputGroup
					label="Week Name"
					error={!!errorMessages?.name}
					errorMessage={errorMessages?.name}
				>
					<TextInput
						id="name"
						name="name"
						placeholder="Junior Camp"
						value={values.name}
						onChange={handleChange}
						error={!!errorMessages?.name}
					/>
				</InputGroup>
			</div>
		</form>
	</Modal>;
};

export default AddWeekModal;
