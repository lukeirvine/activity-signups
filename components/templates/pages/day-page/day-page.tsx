import { useParams } from "next/navigation";
import React from "react";
import { CloudArrowUpIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useListenCollection, useReadDoc } from "@/hooks/use-firebase";
import { Activities, Activity, Day } from "@/types/firebase-types";
import ActivityTable from "@/components/organisms/tables/activity-table/activity-table";
import UploadCSVModal from "@/components/organisms/modals/upload-csv-modal/upload-csv-modal";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import { printActivitiesPDF } from "@/helpers/print";

type DayPageProps = {};

const DayPage: React.FC<Readonly<DayPageProps>> = () => {
  const params = useParams();
  const { dayid, weekid } = params;
  const dayId = typeof dayid === "string" ? dayid : dayid[0];

  const { data: day, loading: dayLoading } = useReadDoc<Day>({
    collectionId: `weeks/${weekid}/days`,
    docId: dayId,
  });
  const { docs: activities, loading: activitiesLoading } =
    useListenCollection<Activity>({
      collectionId: `weeks/${weekid}/days/${dayId}/activities`,
    });

  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = React.useState(false);
  const [isPrintLoading, setIsPrintLoading] = React.useState(false);

  const handlePrintPDF = async (activities: Activities) => {
    setIsPrintLoading(true);
    await printActivitiesPDF(activities);
    setIsPrintLoading(false);
  };

  return (
    <div>
      {activitiesLoading && (
        <div className="flex w-full justify-center py-8">
          <div className="loading loading-dots loading-lg"></div>
        </div>
      )}
      {activities === undefined && (
        <div className="py-8 prose">
          <h2 className="mb-2">No activities</h2>
          <button
            className="btn btn-primary"
            onClick={() => setIsUploadCSVModalOpen(true)}
          >
            Upload CSV
          </button>
        </div>
      )}
      {activities && (
        <div className="mt-4 flex flex-col items-start">
          <div className="prose flex gap-2">
            <IconButton
              onClick={() => setIsUploadCSVModalOpen(true)}
              tooltip="Upload CSV"
              icon={CloudArrowUpIcon}
            />
            <IconButton
              onClick={() => handlePrintPDF(activities)}
              tooltip="Print PDF"
              icon={PrinterIcon}
              loading={isPrintLoading}
            />
          </div>
          <ActivityTable activities={activities} />
        </div>
      )}
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
