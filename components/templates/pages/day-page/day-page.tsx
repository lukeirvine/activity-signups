import { useParams, useRouter } from "next/navigation";
import React from "react";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useListenCollection, useReadDoc } from "@/hooks/use-firebase";
import {
  Activity,
  Day,
  Department,
  Occurrence,
  Week,
} from "@/types/firebase-types";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import { printActivitiesPDF } from "@/helpers/print";
import { convertDateToDay } from "@/helpers/utils";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { deleteCollection, deleteDoc } from "@/helpers/firebase";
import useActionVerificationModal from "@/hooks/use-action-verification-modal";
import ActionVerificationModal from "@/components/molecules/alerts/action-verification-modal/action-verification-modal";
import CreateOccurrenceForm from "@/components/organisms/forms/create-occurrence-form/create-occurrence-form";
import ActivityTable from "@/components/organisms/tables/activity-table/activity-table";
import { convertArrayToObject, enhanceOccurrences } from "@/helpers/data";
import DuplicateDayModal from "@/components/organisms/modals/duplicate-day-modal/duplicate-day-modal";

type DayPageProps = {};

const DayPage: React.FC<Readonly<DayPageProps>> = () => {
  const params = useParams();
  const router = useRouter();
  const { dayid, weekid } = params;
  const dayId = typeof dayid === "string" ? dayid : dayid[0];
  const weekId = typeof weekid === "string" ? weekid : weekid[0];

  const { data: day, loading: dayLoading } = useReadDoc<Day>({
    collectionId: `weeks/${weekid}/days`,
    docId: dayId,
  });
  const { data: week, loading: weekLoading } = useReadDoc<Week>({
    collectionId: "weeks",
    docId: weekId,
  });
  const { docs: occurrences, loading: occurrencesLoading } =
    useListenCollection<Occurrence>({
      collectionId: `weeks/${weekid}/days/${dayId}/occurrences`,
    });

  const { docs: activities, loading: activitiesLoading } =
    useListenCollection<Activity>({
      collectionId: `activities`,
    });
  const filteredActivities = convertArrayToObject<Activity>(
    Object.values(activities || {}).filter(
      (act) => act.activitySetId === week?.activitySetId,
    ),
  );

  const { docs: departments, loading: departmentsLoading } =
    useListenCollection<Department>({
      collectionId: `departments`,
    });

  const [isPrintLoading, setIsPrintLoading] = React.useState(false);
  const [isDayActionLoading, setIsDayActionLoading] = React.useState(false);
  const [isDuplicateDayModalOpen, setIsDuplicateDayModalOpen] =
    React.useState(false);

  const {
    actionVerification,
    setActionVerification,
    updateButtonLoading,
    closeActionVerification,
  } = useActionVerificationModal();

  const exportFileName =
    day && week
      ? `activities-${week?.name}-${convertDateToDay(new Date(day?.date || ""))}`
      : "";

  const handlePrintPDF = async () => {
    setIsPrintLoading(true);
    try {
      if (occurrences && filteredActivities && week && day) {
        console.log(enhanceOccurrences(occurrences, filteredActivities));
        await printActivitiesPDF({
          enhancedOccurrences: enhanceOccurrences(
            occurrences,
            filteredActivities,
          ),
          filename: exportFileName + ".pdf",
          week: week,
          day: day,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsPrintLoading(false);
  };

  // const handleDownloadCSV = async () => {
  //   let csv = `Period,Name,Headcount,Secondary Headcount Name,Secondary Headcount,Notes\n`;
  //   const data = Object.values(activities || {})
  //     ?.map((activity) => {
  //       return `"${activity.period.join(",")}","${activity.name}","${activity.headcount}","${activity.secondaryHeadcountName}","${activity.secondaryHeadcount}","${activity.notes}"`;
  //     })
  //     .join("\n");
  //   csv += data;

  //   downloadCSV(csv, exportFileName + ".csv");
  // };

  const deleteData = async () => {
    setIsDayActionLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/occurrences`,
    });
    setIsDayActionLoading(false);
    closeActionVerification();
  };

  const handleDeleteData = () => {
    setActionVerification({
      isOpen: true,
      title: "Delete Data",
      message: "Are you sure you want to delete all data for this day?",
      onClose: closeActionVerification,
      buttons: [
        {
          label: "Delete",
          variant: "primary",
          onClick: deleteData,
        },
        {
          label: "Cancel",
          variant: "ghost",
          onClick: closeActionVerification,
        },
      ],
    });
  };

  const deleteDay = async () => {
    setIsDayActionLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });
    await deleteDoc({
      collectionId: `weeks/${weekid}/days`,
      docId: dayId,
    });
    setIsDayActionLoading(false);
    router.push(`/weeks/${weekid}`);
  };

  const handleDeleteDay = () => {
    setActionVerification({
      isOpen: true,
      title: "Delete Day",
      message: "Are you sure you want to delete this day?",
      onClose: closeActionVerification,
      buttons: [
        {
          label: "Delete",
          variant: "primary",
          onClick: deleteDay,
        },
        {
          label: "Cancel",
          variant: "ghost",
          onClick: closeActionVerification,
        },
      ],
    });
  };

  const handleDuplicateDay = () => {
    setIsDuplicateDayModalOpen(true);
  };

  let actions = [];
  if (occurrences) {
    // actions.push({
    //   label: "Download CSV",
    //   onClick: handleDownloadCSV,
    //   loading: false,
    // });
    actions.push({
      label: "Delete Data",
      onClick: handleDeleteData,
      loading: isDayActionLoading,
    });
  }
  if (day) {
    actions.push({
      label: "Delete Day",
      onClick: handleDeleteDay,
      loading: isDayActionLoading,
    });
  }
  if (day && occurrences) {
    actions.push({
      label: "Duplicate Day",
      onClick: handleDuplicateDay,
      loading: isDayActionLoading,
    });
  }

  return (
    <div>
      {activitiesLoading && (
        <div className="flex w-full justify-center py-8">
          <div className="loading loading-dots loading-lg"></div>
        </div>
      )}
      <div className="mt-4 mb-12 flex flex-col items-start">
        <div className="flex gap-2">
          {filteredActivities && occurrences && (
            <IconButton
              onClick={handlePrintPDF}
              tooltip="Print PDF"
              icon={PrinterIcon}
              loading={isPrintLoading}
            />
          )}
          <Dropdown
            button={
              <div className="btn btn-ghost btn-sm px-2">
                <EllipsisHorizontalIcon className="w-7 h-7 text-base-content" />
              </div>
            }
            items={actions}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {filteredActivities && (
            <CreateOccurrenceForm activities={filteredActivities} />
          )}
          {filteredActivities && occurrences && departments && (
            <ActivityTable
              activities={filteredActivities}
              occurrences={occurrences}
              departments={departments}
            />
          )}
        </div>
        {occurrences === undefined && (
          <div className="py-8 w-full flex justify-center">
            <div className="prose">
              <h2 className="mb-2">No activities</h2>
            </div>
          </div>
        )}
      </div>
      <ActionVerificationModal
        {...actionVerification}
        onClose={closeActionVerification}
      />
      {day && occurrences && (
        <DuplicateDayModal
          isOpen={isDuplicateDayModalOpen}
          onClose={() => setIsDuplicateDayModalOpen(false)}
          weekId={weekId}
          day={day}
          occurrences={occurrences}
        />
      )}
    </div>
  );
};

export default DayPage;
