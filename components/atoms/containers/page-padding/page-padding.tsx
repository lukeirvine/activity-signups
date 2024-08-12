import React, { ReactNode } from "react";

type PagePaddingProps = {
  children: ReactNode;
};

const PagePadding: React.FC<Readonly<PagePaddingProps>> = ({ children }) => {
  return <div className="h-screen pt-16 bg-base-100">{children}</div>;
};

export default PagePadding;
