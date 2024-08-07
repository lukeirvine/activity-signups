import { PlusIcon } from "@heroicons/react/16/solid";
import { useParams } from "next/navigation";
import React, { ReactNode } from "react";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import AddDayModal from "@/components/organisms/modals/add-day-modal/add-day-modal";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import { useReadDoc } from "@/hooks/use-firebase";
import { Week } from "@/types/firebase-types";
import { getEndDateFromStartDate, stringToDate } from "@/helpers/utils";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";

type WeekLayoutProps = {
  children: ReactNode;
};

const WeekLayout: React.FC<Readonly<WeekLayoutProps>> = ({ children }) => {
  const params = useParams();
  const { weekid: rawWeekId, dayid } = params;
  const weekId = typeof rawWeekId === "string" ? rawWeekId : rawWeekId[0];

  const { data: week, loading: weekLoading } = useReadDoc<Week>({
    collectionId: "weeks",
    docId: weekId,
  });

  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = React.useState(false);

  return (
    <>
      <PageContainer>
        <div className="flex flex-col gap-4">
          <div>
            {week && (
              <div className="prose m-0 p-0">
                <div className="flex items-center gap-6">
                  <h1 className="p-0 m-0">{week.name}</h1>
                  <div className="flex items-center">
                    <IconButton
                      onClick={() => setIsAddWeekModalOpen(true)}
                      tooltip="Add Day"
                      icon={PlusIcon}
                      tooltipPosition="bottom"
                    />
                  </div>
                </div>
                <p className="m-0">
                  {stringToDate(week.startDate).toLocaleDateString()} -{" "}
                  {getEndDateFromStartDate(
                    stringToDate(week.startDate),
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
            {week === undefined && (
              <div className="prose">
                <h1>Week Not Found</h1>
              </div>
            )}
            {weekLoading && (
              <div className="skeleton w-full max-w-xs h-10"></div>
            )}
          </div>
          {week && <TabNav />}
        </div>
        {children}
      </PageContainer>
      {week && (
        <AddDayModal
          isOpen={isAddWeekModalOpen}
          onClose={() => setIsAddWeekModalOpen(false)}
          weekStartDate={new Date(week.startDate)}
          weekId={weekId}
        />
      )}
    </>
  );
};

export default WeekLayout;
