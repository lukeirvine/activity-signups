import React, { ReactNode } from "react";

type SidenavPageContainerProps = {
  children: ReactNode;
  sidenav: ReactNode;
};

const SidenavPageContainer: React.FC<Readonly<SidenavPageContainerProps>> = ({
  children,
  sidenav,
}) => {
  return (
    <div>
      <div className="hidden sm:block">
        <div className="fixed top-0 left-0 h-screen pt-16">{sidenav}</div>
      </div>
      <div className="h-full sm:pl-56">{children}</div>
    </div>
  );
};

export default SidenavPageContainer;
