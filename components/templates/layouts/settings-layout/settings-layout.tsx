import React, { ReactNode } from "react";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PageContainer from "@/components/atoms/containers/page-container/page-container";

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
                  { label: "Account", href: "/settings/account" },
                  { label: "Billing", href: "/settings/billing" },
                ]}
              />
            }
          >
            <PageContainer>
              <div className="flex flex-col gap-4">
                <div className="prose">
                  <h1>Settings</h1>
                </div>
                {children}
              </div>
            </PageContainer>
          </SidenavPageContainer>
        </ProtectedPage>
      </PagePadding>
    </>
  );
};

export default SettingsLayout;
