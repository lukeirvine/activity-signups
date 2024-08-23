import { useParams, useRouter } from "next/navigation";
import React from "react";
import { CloudArrowUpIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useListenCollection, useReadDoc } from "@/hooks/use-firebase";
import { Activities, Activity, Day, Week } from "@/types/firebase-types";
import ActivityTable from "@/components/organisms/tables/activity-table/activity-table";
import UploadCSVModal from "@/components/organisms/modals/upload-csv-modal/upload-csv-modal";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import { printActivitiesPDF } from "@/helpers/print";
import { convertDateToDay, downloadCSV } from "@/helpers/utils";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { deleteCollection, deleteDoc } from "@/helpers/firebase";
import useActionVerificationModal from "@/hooks/use-action-verification-modal";
import ActionVerificationModal from "@/components/molecules/alerts/action-verification-modal/action-verification-modal";

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
  const { docs: activities, loading: activitiesLoading } =
    useListenCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });

  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = React.useState(false);
  const [isPrintLoading, setIsPrintLoading] = React.useState(false);
  const [isDeleteDataLoading, setIsDeleteDataLoading] = React.useState(false);
  const [isDeleteDayLoading, setIsDeleteDayLoading] = React.useState(false);

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

  const handlePrintPDF = async (activities: Activities) => {
    setIsPrintLoading(true);
    try {
      await printActivitiesPDF(activities, exportFileName + ".pdf");
    } catch (error) {
      console.error(error);
    }
    setIsPrintLoading(false);
  };

  const handleDownloadCSV = async () => {
    let csv = `Period,Name,Headcount,Secondary Headcount Name,Secondary Headcount,Notes\n`;
    const data = Object.values(activities || {})
      ?.map((activity) => {
        return `"${activity.period.join(",")}","${activity.name}","${activity.headcount}","${activity.secondaryHeadcountName}","${activity.secondaryHeadcount}","${activity.notes}"`;
      })
      .join("\n");
    csv += data;

    downloadCSV(csv, exportFileName + ".csv");
  };

  const deleteData = async () => {
    setIsDeleteDataLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });
    setIsDeleteDataLoading(false);
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
    setIsDeleteDayLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });
    await deleteDoc({
      collectionId: `weeks/${weekid}/days`,
      docId: dayId,
    });
    setIsDeleteDayLoading(false);
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

  let actions = [];
  if (activities) {
    actions.push({
      label: "Download CSV",
      onClick: handleDownloadCSV,
      loading: false,
    });
    actions.push({
      label: "Delete Data",
      onClick: handleDeleteData,
      loading: isDeleteDataLoading,
    });
  }
  if (day) {
    actions.push({
      label: "Delete Day",
      onClick: handleDeleteDay,
      loading: isDeleteDayLoading,
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
          <IconButton
            onClick={() => setIsUploadCSVModalOpen(true)}
            tooltip="Upload CSV"
            icon={CloudArrowUpIcon}
          />
          {activities && (
            <IconButton
              onClick={() => handlePrintPDF(activities)}
              tooltip="Print PDF"
              icon={PrinterIcon}
              loading={isPrintLoading}
            />
          )}
          <Dropdown
            button={
              <div className="btn btn-ghost btn-sm px-2">
                <EllipsisHorizontalIcon className="w-7 h-7" />
              </div>
            }
            items={actions}
          />
        </div>
        {activities && <ActivityTable activities={activities} />}
        {activities === undefined && (
          <div className="py-8 w-full flex justify-center">
            <div className="prose">
              <h2 className="mb-2">No activities</h2>
            </div>
          </div>
        )}
      </div>
      {weekid && dayid && (
        <UploadCSVModal
          isOpen={isUploadCSVModalOpen}
          onClose={() => setIsUploadCSVModalOpen(false)}
        />
      )}
      <ActionVerificationModal
        {...actionVerification}
        onClose={closeActionVerification}
      />
    </div>
  );
};

export default DayPage;
