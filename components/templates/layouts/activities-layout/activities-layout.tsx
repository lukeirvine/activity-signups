import React, { ReactNode } from "react";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import SidenavPageContainer from "@/components/atoms/containers/sidenav-page-container/sidenav-page-container";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import LayoutTitleContainer from "@/components/atoms/containers/layout-title-container/layout-title-container";
import { useListenCollection } from "@/hooks/use-firebase";
import { Activity, Department } from "@/types/firebase-types";
import ActivityMenuHeader from "@/components/molecules/activity-menu-header/activity-menu-header";
import useTableQueryParams from "@/hooks/use-table-query-params";

type ActivitiesLayoutProps = {
  children: ReactNode;
};

const ActivitiesLayout: React.FC<Readonly<ActivitiesLayoutProps>> = ({
  children,
}) => {
  const { docs: departments } = useListenCollection<Department>({
    collectionId: "departments",
  });

  const { docs: activities, loading: activitiesLoading } =
    useListenCollection<Activity>({
      collectionId: "activities",
    });

  const { queryParamState } = useTableQueryParams({
    fields: ["activity-set"],
    initialize: () => ({
      "activity-set": "",
    }),
  });

  const filteredActivities = Object.values(activities || {}).filter(
    (activity) => activity.activitySetId === queryParamState["activity-set"],
  );

  const uniqueDepartmentIds = new Set(
    Object.values(filteredActivities || {}).map(
      (activity) => activity.department,
    ),
  );
  const uniqueDepartments = Array.from(uniqueDepartmentIds)
    .map((deptId) => departments?.[deptId])
    .sort((a, b) => a?.name?.localeCompare(b?.name || "") ?? 0);

  // Put the 'No Department' department at the top of the list
  if (uniqueDepartments[uniqueDepartments.length - 1] === undefined) {
    uniqueDepartments.pop();
    uniqueDepartments.unshift(undefined);
  }

  return (
    <>
      <PagePadding>
        <ProtectedPage>
          <SidenavPageContainer
            sidenav={
              <SideNav
                header={<ActivityMenuHeader />}
                groups={uniqueDepartments.map((dept) => ({
                  title: dept?.name || "No Department",
                  items: Object.values(filteredActivities || {})
                    .filter((act) => act.department === (dept?.id ?? ""))
                    .map((activity) => ({
                      label: activity.name,
                      href: `/activities/${activity.id}?activity-set=${activity.activitySetId}`,
                    })),
                }))}
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
