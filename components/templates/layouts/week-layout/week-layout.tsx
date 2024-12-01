import { PlusIcon } from "@heroicons/react/16/solid";
import { useParams, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import AddDayModal from "@/components/organisms/modals/add-day-modal/add-day-modal";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import { useListenCollection, useListenDoc } from "@/hooks/use-firebase";
import { ActivitySet, Day, Week } from "@/types/firebase-types";
import { getEndDateFromStartDate, stringToDate } from "@/helpers/utils";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import Button from "@/components/atoms/buttons/button/button";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { deleteDoc } from "@/helpers/firebase";
import ActionVerificationModal from "@/components/molecules/alerts/action-verification-modal/action-verification-modal";
import useActionVerificationModal from "@/hooks/use-action-verification-modal";
import AddWeekModal from "@/components/organisms/modals/add-week-modal/add-week-modal";

type WeekLayoutProps = {
  children: ReactNode;
};

const WeekLayout: React.FC<Readonly<WeekLayoutProps>> = ({ children }) => {
  const params = useParams();
  const router = useRouter();
  const { weekid: rawWeekId, dayid } = params;
  const weekId = typeof rawWeekId === "string" ? rawWeekId : rawWeekId[0];

  const { data: week, loading: weekLoading } = useListenDoc<Week>({
    collectionId: "weeks",
    docId: weekId,
  });

  const { data: activitySet } = useListenDoc<ActivitySet>({
    collectionId: "activity-sets",
    docId: week?.activitySetId || "null",
  });

  const { docs: days, loading: daysLoading } = useListenCollection<Day>({
    collectionId: `weeks/${weekId}/days`,
  });

  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(false);
  const [isDeletingWeek, setIsDeletingWeek] = useState(false);

  const {
    actionVerification,
    setActionVerification,
    updateButtonLoading,
    closeActionVerification,
  } = useActionVerificationModal();

  const deleteWeek = async () => {
    setIsDeletingWeek(true);
    await deleteDoc({
      collectionId: `weeks`,
      docId: weekId,
    });
    setIsDeletingWeek(false);
    router.push(`/weeks`);
  };

  const handleDeleteWeek = () => {
    setActionVerification({
      isOpen: true,
      title: "Delete Week",
      message: "Are you sure you want to delete this week?",
      onClose: closeActionVerification,
      buttons: [
        {
          label: "Delete",
          variant: "primary",
          onClick: deleteWeek,
        },
        {
          label: "Cancel",
          variant: "ghost",
          onClick: closeActionVerification,
        },
      ],
    });
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
                    <h1 className="p-0 m-0 text-primary">{week.name}</h1>
                  </div>
                  <div className="flex items-center">
                    <IconButton
                      onClick={() => setIsAddDayModalOpen(true)}
                      tooltip="Add Day"
                      icon={PlusIcon}
                      tooltipPosition="bottom"
                    />
                    <Dropdown
                      button={
                        <div className="btn btn-ghost btn-sm px-2">
                          <EllipsisHorizontalIcon className="w-7 h-7 text-base-content" />
                        </div>
                      }
                      items={[
                        {
                          label: "Edit Week",
                          onClick: () => setIsAddWeekModalOpen(true),
                        },
                        {
                          label: "Delete Week",
                          onClick: handleDeleteWeek,
                          loading: isDeletingWeek,
                        },
                      ]}
                    />
                  </div>
                </div>
                <p className="m-0 text-base-content">
                  {stringToDate(week.startDate).toLocaleDateString()} -{" "}
                  {getEndDateFromStartDate(
                    stringToDate(week.startDate),
                  ).toLocaleDateString()}
                </p>
                {activitySet && (
                  <p className="m-0 mt-1 text-base-content text-sm">
                    <span className="font-semibold">Activity Set:</span>{" "}
                    <span className="">{activitySet.name}</span>
                  </p>
                )}
                {!activitySet && (
                  <div className="w-full max-w-48 h-5 mt-1 skeleton" />
                )}
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
                onClick={() => setIsAddDayModalOpen(true)}
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
          isOpen={isAddDayModalOpen}
          onClose={() => setIsAddDayModalOpen(false)}
          weekStartDate={new Date(week.startDate)}
          weekId={weekId}
        />
      )}
      <ActionVerificationModal
        {...actionVerification}
        onClose={closeActionVerification}
      />
      <AddWeekModal
        isOpen={isAddWeekModalOpen}
        onClose={() => setIsAddWeekModalOpen(false)}
        week={week}
      />
    </>
  );
};

export default WeekLayout;
