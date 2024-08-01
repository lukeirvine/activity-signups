import Modal from '@/components/atoms/modal/modal';
import React, { ReactNode } from 'react';

type MyComponentProps = {
	id: string;
};

const AddWeekModal: React.FC<Readonly<MyComponentProps>> = ({ id }) => {
	return <Modal
		id="add_week_modal"
		title="Add Week"
	>
		Add Week Modal
	</Modal>;
};

export default AddWeekModal;
