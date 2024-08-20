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

  const handleDeleteData = async () => {
    setIsDeleteDataLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });
    setIsDeleteDataLoading(false);
  };

  const handleDeleteDay = async () => {
    setIsDeleteDayLoading(true);
    await deleteCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });
    await deleteDoc({
      collectionId: `weeks/${weekid}/days`,
      docId: dayId,
    });
    setIsDeleteDayLoading(false);
    router.push(`/dashboard/${weekid}`);
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
    </div>
  );
};

export default DayPage;
