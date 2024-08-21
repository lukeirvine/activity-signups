import React, { ReactNode } from "react";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";

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
                  { label: "Profile", href: "/settings/profile" },
                  { label: "Account", href: "/settings/account" },
                  { label: "Billing", href: "/settings/billing" },
                ]}
              />
            }
          >
            {children}
          </SidenavPageContainer>
        </ProtectedPage>
      </PagePadding>
    </>
  );
};

export default SettingsLayout;
