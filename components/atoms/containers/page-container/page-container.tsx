import React, { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer: React.FC<Readonly<PageContainerProps>> = ({
  children,
}) => {
  return <div className="py-4 px-12">{children}</div>;
};

export default PageContainer;
