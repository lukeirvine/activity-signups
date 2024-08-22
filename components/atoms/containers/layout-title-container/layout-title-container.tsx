import React, { ReactNode } from "react";

type LayoutTitleContainerProps = {
  children: ReactNode;
  title: string;
};

const LayoutTitleContainer: React.FC<Readonly<LayoutTitleContainerProps>> = ({
  children,
  title,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="prose">
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default LayoutTitleContainer;
