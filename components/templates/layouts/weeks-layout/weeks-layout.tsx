import React, { ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import { useListenCollection } from "@/hooks/use-firebase";
import { Week } from "@/types/firebase-types";
import AddWeekModal from "@/components/organisms/modals/add-week-modal/add-week-modal";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";

type WeeksLayoutProps = {
  children: ReactNode;
};

const WeeksLayout: React.FC<Readonly<WeeksLayoutProps>> = ({ children }) => {
  const { docs: weeks, loading: weeksLoading } = useListenCollection<Week>({
    collectionId: "weeks",
  });

  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = React.useState(false);

  return (
    <>
      <PagePadding>
        <ProtectedPage>
          <SidenavPageContainer
            sidenav={
              <SideNav
                items={Object.values(weeks || {})
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .map((week) => ({
                    label: week.name,
                    href: `/weeks/${week.id}`,
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
            }
          >
            {children}
          </SidenavPageContainer>
        </ProtectedPage>
      </PagePadding>
      <AddWeekModal
        isOpen={isAddWeekModalOpen}
        onClose={() => setIsAddWeekModalOpen(false)}
      />
    </>
  );
};

export default WeeksLayout;
