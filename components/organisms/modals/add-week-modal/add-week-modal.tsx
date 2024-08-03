import TextInput from '@/components/atoms/form/text-input/text-input';
import Modal from '@/components/atoms/modal/modal';
import useFormHooks from '@/hooks/use-form-hooks';
import React, { ReactNode, useMemo } from 'react';

type MyComponentProps = {
	id: string;
};

interface AddWeekData {
	nickname: string,
	startDate: Date,
}

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({ id }) => {
	const requiredFields: (keyof AddWeekData)[] = useMemo(() => {
		return ["nickname", "startDate"];
	}, []);
	const formData: AddWeekData = {
		nickname: "",
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
				id="nickname"
				name="nickname"
				label="Nickname"
				placeholder="Enter a nickname"
				value={values.nickname}
				onChange={handleChange}
				error={!!errorMessages?.nickname}
				errorMessage={errorMessages?.nickname}
			/>
		</form>
	</Modal>;
};

export default AddWeekModal;
