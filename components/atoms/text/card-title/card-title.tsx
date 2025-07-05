import React, { ReactNode } from "react";

type CardTitleProps = {
  children: ReactNode;
};

const CardTitle: React.FC<Readonly<CardTitleProps>> = ({ children }) => {
  return <div className="text-lg font-bold mb-2">{children}</div>;
};

export default CardTitle;
