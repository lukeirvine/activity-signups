import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useListenDoc } from "@/hooks/use-firebase";
import { Activity } from "@/types/firebase-types";
import FullPageLoading from "@/components/atoms/full-page-loading/full-page-loading";
import ActivityForm from "@/components/organisms/forms/activity-form/activity-form";
import { deleteDoc } from "@/helpers/firebase";
import { useActionVerificationModalContext } from "@/components/contexts/action-verification-modal-context/action-verification-modal-context";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import useTableQueryParams from "@/hooks/use-table-query-params";

type ActivityPageProps = {};

const ActivityPage: React.FC<Readonly<ActivityPageProps>> = () => {
  const router = useRouter();
  const params = useParams();
  const { actid } = params;
  const actId = typeof actid === "string" ? actid : actid[0];

  const { setActionVerification, closeActionVerification } =
    useActionVerificationModalContext();

  const { data: activity, loading: activityLoading } = useListenDoc<Activity>({
    collectionId: "activities",
    docId: actId,
  });

  const { queryParamState } = useTableQueryParams({
    fields: ["activity-set"],
    initialize: () => ({
      "activity-set": "",
    }),
  });
  const activitySetParam = queryParamState["activity-set"];

  // redirect to the base activity page if the selected activity set does not match
  // this activity's activity set
  useEffect(() => {
    if (
      activity &&
      activitySetParam &&
      activitySetParam !== activity.activitySetId
    ) {
      router.replace(`/activities?activity-set=${activitySetParam}`);
    }
  }, [queryParamState, activitySetParam, activity, router]);

  const handleDeleteClick = () => {
    setActionVerification({
      isOpen: true,
      onClose: closeActionVerification,
      title: `Delete ${activity?.name ?? "Activity"}`,
      message:
        "Are you sure you want to delete this activity? All occurrences will be deleted as well.",
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
    await deleteDoc({
      collectionId: "activities",
      docId: actId,
    });
    closeActionVerification();
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
              <h2 className="text-primary">{activity.name}</h2>
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
