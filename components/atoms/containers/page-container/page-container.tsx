import React, { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer: React.FC<Readonly<PageContainerProps>> = ({
  children,
  className,
}) => {
  return <div className={`py-4 px-12 ${className}`}>{children}</div>;
};

export default PageContainer;
