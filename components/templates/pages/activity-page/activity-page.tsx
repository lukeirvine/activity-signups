import { useParams } from "next/navigation";
import React from "react";
import { useListenDoc } from "@/hooks/use-firebase";
import { Activity } from "@/types/firebase-types";

type ActivityPageProps = {};

const ActivityPage: React.FC<Readonly<ActivityPageProps>> = () => {
  const params = useParams();
  const { actid } = params;
  const actId = typeof actid === "string" ? actid : actid[0];

  const { data: activity, loading: activityLoading } = useListenDoc<Activity>({
    collectionId: "activities",
    docId: actId,
  });

  return <div>{!activity ? "Loading..." : activity.name}</div>;
};

export default ActivityPage;
