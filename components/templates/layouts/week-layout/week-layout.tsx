import { PlusIcon } from "@heroicons/react/16/solid";
import { useParams, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import AddDayModal from "@/components/organisms/modals/add-day-modal/add-day-modal";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import { useListenCollection, useReadDoc } from "@/hooks/use-firebase";
import { Day, Week } from "@/types/firebase-types";
import { getEndDateFromStartDate, stringToDate } from "@/helpers/utils";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import Button from "@/components/atoms/buttons/button/button";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { deleteDoc } from "@/helpers/firebase";

type WeekLayoutProps = {
  children: ReactNode;
};

const WeekLayout: React.FC<Readonly<WeekLayoutProps>> = ({ children }) => {
  const params = useParams();
  const router = useRouter();
  const { weekid: rawWeekId, dayid } = params;
  const weekId = typeof rawWeekId === "string" ? rawWeekId : rawWeekId[0];

  const { data: week, loading: weekLoading } = useReadDoc<Week>({
    collectionId: "weeks",
    docId: weekId,
  });

  const { docs: days, loading: daysLoading } = useListenCollection<Day>({
    collectionId: `weeks/${weekId}/days`,
  });

  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [isDeletingWeek, setIsDeletingWeek] = useState(false);

  const deleteWeek = async () => {
    setIsDeletingWeek(true);
    await deleteDoc({
      collectionId: `weeks`,
      docId: weekId,
    });
    setIsDeletingWeek(false);
    router.push(`/dashboard`);
  };

  return (
    <>
      <PageContainer>
        <div className="flex flex-col gap-4">
          <div>
            {week && (
              <div className="m-0 p-0">
                <div className="flex items-center gap-6">
                  <div className="prose">
                    <h1 className="p-0 m-0">{week.name}</h1>
                  </div>
                  <div className="flex items-center">
                    <IconButton
                      onClick={() => setIsAddWeekModalOpen(true)}
                      tooltip="Add Day"
                      icon={PlusIcon}
                      tooltipPosition="bottom"
                    />
                    <Dropdown
                      button={
                        <div className="btn btn-ghost btn-sm px-2">
                          <EllipsisHorizontalIcon className="w-7 h-7" />
                        </div>
                      }
                      items={[
                        {
                          label: "Delete Week",
                          onClick: deleteWeek,
                          loading: isDeletingWeek,
                        },
                      ]}
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
          {week && <TabNav days={days} />}
          {!days && !daysLoading && (
            <div className="w-full flex flex-col items-center">
              <div className="prose">
                <h2>No Days</h2>
              </div>
              <Button
                className="btn-link"
                onClick={() => setIsAddWeekModalOpen(true)}
              >
                Add Day to get started
              </Button>
            </div>
          )}
        </div>
        {week && children}
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
