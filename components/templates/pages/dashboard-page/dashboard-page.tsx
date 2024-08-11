import React, { ReactNode } from "react";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";

type DashboardPageProps = {
  children: ReactNode;
};

const DashboardPage: React.FC<Readonly<DashboardPageProps>> = ({
  children,
}) => {
  return (
    <div className="h-screen pt-16 bg-base-100">
      <div className="fixed top-0 left-0 h-screen pt-16">
        <SideNav />
      </div>
      <div className="h-full pl-56">{children}</div>
    </div>
  );
};

export default DashboardPage;
