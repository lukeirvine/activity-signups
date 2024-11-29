import { useParams } from "next/navigation";
import React from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useListenDoc } from "@/hooks/use-firebase";
import { Activity } from "@/types/firebase-types";
import FullPageLoading from "@/components/atoms/full-page-loading/full-page-loading";
import ActivityForm from "@/components/organisms/forms/activity-form/activity-form";
import { deleteDoc } from "@/helpers/firebase";
import { useActionVerificationModalContext } from "@/components/contexts/action-verification-modal-context/action-verification-modal-context";
import Dropdown from "@/components/atoms/dropdown/dropdown";

type ActivityPageProps = {};

const ActivityPage: React.FC<Readonly<ActivityPageProps>> = () => {
  const params = useParams();
  const { actid } = params;
  const actId = typeof actid === "string" ? actid : actid[0];
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const { actionVerification, setActionVerification, closeActionVerification } =
    useActionVerificationModalContext();

  const { data: activity, loading: activityLoading } = useListenDoc<Activity>({
    collectionId: "activities",
    docId: actId,
  });

  const handleDeleteClick = () => {
    setActionVerification({
      isOpen: true,
      onClose: closeActionVerification,
      title: `Delete ${activity?.name ?? "Activity"}`,
      message: "Are you sure you want to delete this activity?",
      buttons: [
        {
          label: "Delete",
          variant: "primary",
          onClick: handleDeleteActivity,
          handleLoading: true,
        },
        {
          label: "Cancel",
          variant: "ghost",
          onClick: closeActionVerification,
        },
      ],
    });
  };

  const handleDeleteActivity = async () => {
    setDeleteLoading(true);
    await deleteDoc({
      collectionId: "activities",
      docId: actId,
    });
    setDeleteLoading(false);
  };

  const actions = [
    {
      label: "Delete",
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div>
      {activityLoading && <FullPageLoading />}
      {activity && (
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="prose">
              <h2>{activity.name}</h2>
            </div>
            <Dropdown
              button={
                <div className="btn btn-ghost btn-sm px-2">
                  <EllipsisHorizontalIcon className="w-7 h-7" />
                </div>
              }
              items={actions}
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
