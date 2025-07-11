import React, { ReactNode } from "react";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import LayoutTitleContainer from "@/components/atoms/containers/layout-title-container/layout-title-container";

type SettingsLayoutProps = {
  children: ReactNode;
};

const SettingsLayout: React.FC<Readonly<SettingsLayoutProps>> = ({
  children,
}) => {
  return (
    <>
      <PagePadding>
        <ProtectedPage>
          <SidenavPageContainer
            sidenav={
              <SideNav
                items={[
                  { label: "Departments", href: "/settings/departments" },
                  { label: "Activity Sets", href: "/settings/activity-sets" },
                  { label: "Account", href: "/settings/account" },
                ]}
              />
            }
          >
            <PageContainer>
              <LayoutTitleContainer title="Settings">
                {children}
              </LayoutTitleContainer>
            </PageContainer>
          </SidenavPageContainer>
        </ProtectedPage>
      </PagePadding>
    </>
  );
};

export default SettingsLayout;
