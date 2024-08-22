import React, { ReactNode, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import LayoutTitleContainer from "@/components/atoms/containers/layout-title-container/layout-title-container";
import { useListenCollection } from "@/hooks/use-firebase";
import { Activity } from "@/types/firebase-types";
import Button from "@/components/atoms/buttons/button/button";
import { setDoc } from "@/helpers/firebase";

type ActivitiesLayoutProps = {
  children: ReactNode;
};

const ActivitiesLayout: React.FC<Readonly<ActivitiesLayoutProps>> = ({
  children,
}) => {
  const router = useRouter();

  const { docs: activities, loading: activitiesLoading } =
    useListenCollection<Activity>({
      collectionId: "activities",
    });

  const [createActivityLoading, setCreateActivityLoading] = useState(false);

  const createNewActivity = async () => {
    setCreateActivityLoading(true);
    const result = await setDoc<Activity>({
      collectionId: "activities",
      data: {
        name: "New Activity",
        cost: "",
        highlightedText: "",
        department: "",
        headcount: 8,
        secondaryHeadcountName: "",
        secondaryHeadcount: 0,
        notes: [],
        timeCreated: new Date().toISOString(),
        timeUpdated: new Date().toISOString(),
      },
    });
    setCreateActivityLoading(false);
    if (result.success) {
      router.push(`/activities/${result.uid}`);
    }
  };

  return (
    <>
      <PagePadding>
        <ProtectedPage>
          <SidenavPageContainer
            sidenav={
              <SideNav
                items={Object.values(activities || {})
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((activity) => ({
                    label: activity.name,
                    href: `/activities/${activity.id}`,
                  }))}
                actionButton={
                  <li>
                    <Button
                      variant="ghost"
                      onClick={createNewActivity}
                      loading={createActivityLoading}
                      disabled={createActivityLoading}
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create Activity
                    </Button>
                  </li>
                }
              />
            }
          >
            <PageContainer>
              <LayoutTitleContainer title="Activities">
                {children}
              </LayoutTitleContainer>
            </PageContainer>
          </SidenavPageContainer>
        </ProtectedPage>
      </PagePadding>
    </>
  );
};

export default ActivitiesLayout;
