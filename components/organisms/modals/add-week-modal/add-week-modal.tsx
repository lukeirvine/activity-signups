import Button from '@/components/atoms/button/button';
import InputGroup from '@/components/atoms/form/input-group/input-group';
import TextInput from '@/components/atoms/form/text-input/text-input';
import Modal from '@/components/atoms/modal/modal';
import { createTextChangeEvent } from '@/helpers/forms';
import useFormHooks from '@/hooks/use-form-hooks';
import { DatePicker, DatePickerValue } from '@tremor/react';
import React, { ReactNode, useEffect, useMemo } from 'react';

import "react-datepicker/dist/react-datepicker.css";

type MyComponentProps = {
	isOpen: boolean,
	onClose: () => void,
};

interface AddWeekData {
	name: string,
	startDate: string | undefined,
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
	} = useFormHooks({
		requiredFields,
		initialize: () => formData,
		onSubmit: async () => {
			console.log("VALUES", values);
		}
	});

	useEffect(() => {
		console.log("VALUES", values);
	}, [values])
	
	return <Modal
		// id="add_week_modal"
		title="Add Week"
		isOpen={isOpen}
		onClose={onClose}
	>
		<form method="post" onSubmit={handleSubmit} noValidate>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
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
				</div>
				<Button
					loading={isSubmitting}
					disabled={showDisabled}
					className="w-full"
				>
					Save
				</Button>
			</div>
		</form>
	</Modal>;
};

export default AddWeekModal;
