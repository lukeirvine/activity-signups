import { useParams } from "next/navigation";
import React from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useListenDoc } from "@/hooks/use-firebase";
import { Activity } from "@/types/firebase-types";
import FullPageLoading from "@/components/atoms/full-page-loading/full-page-loading";
import ActivityForm from "@/components/organisms/forms/activity-form/activity-form";
import IconButton from "@/components/atoms/buttons/icon-button/icon-button";
import { deleteDoc } from "@/helpers/firebase";

type ActivityPageProps = {};

const ActivityPage: React.FC<Readonly<ActivityPageProps>> = () => {
  const params = useParams();
  const { actid } = params;
  const actId = typeof actid === "string" ? actid : actid[0];
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const { data: activity, loading: activityLoading } = useListenDoc<Activity>({
    collectionId: "activities",
    docId: actId,
  });

  const handleDeleteActivity = async () => {
    setDeleteLoading(true);
    await deleteDoc({
      collectionId: "activities",
      docId: actId,
    });
    setDeleteLoading(false);
  };

  return (
    <div>
      {activityLoading && <FullPageLoading />}
      {activity && (
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="prose">
              <h2>{activity.name}</h2>
            </div>
            <IconButton
              icon={TrashIcon}
              loading={deleteLoading}
              onClick={handleDeleteActivity}
            />
          </div>
          <div className="w-full max-w-lg">
            <ActivityForm activity={activity} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
