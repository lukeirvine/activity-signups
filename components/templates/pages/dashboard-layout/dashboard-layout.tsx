import React, { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/solid";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import { useCurrentUser } from "@/hooks/use-user";
import { useListenCollection } from "@/hooks/use-firebase";
import { Week } from "@/types/firebase-types";
import AddWeekModal from "@/components/organisms/modals/add-week-modal/add-week-modal";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: React.FC<Readonly<DashboardLayoutProps>> = ({
  children,
}) => {
  const user = useCurrentUser();
  const router = useRouter();

  if (user === undefined) {
    router.push("/auth/login");
  }

  const { docs: weeks, loading: weeksLoading } = useListenCollection<Week>({
    collectionId: "weeks",
  });
  const params = useParams();
  const { weekid: weekId } = params;

  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = React.useState(false);

  return (
    <>
      <PagePadding>
        {user === null && (
          <div className="w-screen h-full flex justify-center items center">
            <div className="loading loading-dots loading-lg mb-40"></div>
          </div>
        )}
        {user && (
          <div>
            <div className="fixed top-0 left-0 h-screen pt-16">
              <SideNav
                items={Object.values(weeks || {})
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .map((week) => ({
                    label: week.name,
                    href: `/dashboard/${week.id}`,
                  }))}
                actionButton={
                  <li>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setIsAddWeekModalOpen(true)}
                    >
                      <PlusIcon className="w-5 h-5" />
                      Add Week
                    </button>
                  </li>
                }
              />
            </div>
            <div className="h-full pl-56">{children}</div>
          </div>
        )}
      </PagePadding>
      <AddWeekModal
        isOpen={isAddWeekModalOpen}
        onClose={() => setIsAddWeekModalOpen(false)}
      />
    </>
  );
};

export default DashboardLayout;
