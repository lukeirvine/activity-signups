import React, { ReactNode } from "react";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";

type DashboardPageProps = {
  children: ReactNode;
};

const DashboardPage: React.FC<Readonly<DashboardPageProps>> = ({
  children,
}) => {
  return (
    <PagePadding>
      <div className="fixed top-0 left-0 h-screen pt-16">
        <SideNav />
      </div>
      <div className="h-full pl-56">{children}</div>
    </PagePadding>
  );
};

export default DashboardPage;
