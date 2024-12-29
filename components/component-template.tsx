import React, { ReactNode } from 'react';

type MyComponentProps = {
	children: ReactNode;
};

const MyComponent: React.FC<Readonly<MyComponentProps>> = ({ children }) => {
	return <div>{children}</div>;
};

export default MyComponent;
