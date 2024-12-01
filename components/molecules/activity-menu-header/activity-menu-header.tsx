import { PencilIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Select from "@/components/atoms/form/select/select";
import { useListenCollection } from "@/hooks/use-firebase";
import useTableQueryParams from "@/hooks/use-table-query-params";
import { Activity, ActivitySet } from "@/types/firebase-types";
import Button from "@/components/atoms/buttons/button/button";
import { setDoc } from "@/helpers/firebase";
import { useCookieContext } from "@/components/contexts/cookie-context/cookie-context";

type ActivityMenuHeaderProps = {};

const ActivityMenuHeader: React.FC<Readonly<ActivityMenuHeaderProps>> = () => {
  const router = useRouter();
  const { setCookie, getCookie } = useCookieContext();

  const { docs: activitySets } = useListenCollection<ActivitySet>({
    collectionId: "activity-sets",
  });

  const { queryParamState, updateQueryParams } = useTableQueryParams({
    fields: ["activity-set"],
    initialize: () => ({
      "activity-set": "",
    }),
  });
  const activitySetId = queryParamState["activity-set"];

  const [createActivityLoading, setCreateActivityLoading] = useState(false);

  // set the first activity set as the default activity set in the query params
  useEffect(() => {
    (async () => {
      const cookieSet = await getCookie("activities/activity-set");
      const cookieSetInActivitySets = activitySets?.[cookieSet];
      const firstActivitySet = Object.values(activitySets || {}).sort((a, b) =>
        a.name.localeCompare(b.name),
      )[0];
      if (!activitySetId) {
        if (cookieSetInActivitySets) {
          updateQueryParams({ "activity-set": cookieSet });
        } else if (firstActivitySet?.id) {
          updateQueryParams({ "activity-set": firstActivitySet.id });
          await setCookie("activities/activity-set", firstActivitySet.id);
        }
      }
    })();
  }, [activitySets, activitySetId, updateQueryParams, setCookie, getCookie]);

  const createNewActivity = async () => {
    if (
      queryParamState["activity-set"] &&
      queryParamState["activity-set"].length > 0
    ) {
      setCreateActivityLoading(true);
      const result = await setDoc<Activity>({
        collectionId: "activities",
        data: {
          name: "New Activity",
          activitySetId: queryParamState["activity-set"],
          cost: "",
          highlightedText: "",
          department: "",
          headcount: 8,
          secondaryHeadcountName: "",
          secondaryHeadcount: 0,
          notes: [],
        },
      });
      setCreateActivityLoading(false);
      if (result.success) {
        router.push(`/activities/${result.uid}?activity-set=${activitySetId}`);
      }
    } else {
      // TODO: show error message
      console.error("No activity set selected");
    }
  };

  return (
    <div className="text-base-content">
      {activitySets && (
        <div className="pl-4 pt-4 pr-2 flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <Select
              className="bg-base-200 select-sm text-xs"
              name="activity-set"
              value={queryParamState["activity-set"] || ""}
              onChange={async (event) => {
                updateQueryParams({ "activity-set": event.target.value });
                await setCookie("activities/activity-set", event.target.value);
              }}
              variant="default"
            >
              {Object.values(activitySets).map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </Select>
            <Link
              className="btn btn-xs btn-ghost"
              href="/settings/activity-sets"
            >
              <PencilIcon className="w-4 h-4" />
            </Link>
          </div>
          <Button
            variant="ghost"
            onClick={createNewActivity}
            loading={createActivityLoading}
            disabled={createActivityLoading}
          >
            <PlusIcon className="w-5 h-5" />
            Create Activity
          </Button>
          <div className="divider mt-0 mb-0"></div>
        </div>
      )}
      {!activitySets && <div className="w-full h-6 skeleton"></div>}
    </div>
  );
};

export default ActivityMenuHeader;
