import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import { useCurrentUser } from "@/hooks/use-user";

type DashboardPageProps = {
  children: ReactNode;
};

const DashboardPage: React.FC<Readonly<DashboardPageProps>> = ({
  children,
}) => {
  const user = useCurrentUser();
  const router = useRouter();

  if (user === undefined) {
    router.push("/auth/login");
  }

  return (
    <PagePadding>
      {user === null && (
        <div className="w-screen h-full flex justify-center items center">
          <div className="loading loading-dots loading-lg mb-40"></div>
        </div>
      )}
      {user && (
        <div>
          <div className="fixed top-0 left-0 h-screen pt-16">
            <SideNav />
          </div>
          <div className="h-full pl-56">{children}</div>
        </div>
      )}
    </PagePadding>
  );
};

export default DashboardPage;
