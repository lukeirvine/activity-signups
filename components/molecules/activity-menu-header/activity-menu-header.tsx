import { PencilIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React from "react";
import Select from "@/components/atoms/form/select/select";
import { useListenCollection } from "@/hooks/use-firebase";
import useTableQueryParams from "@/hooks/use-table-query-params";
import { ActivitySet } from "@/types/firebase-types";

type ActivityMenuHeaderProps = {};

const ActivityMenuHeader: React.FC<Readonly<ActivityMenuHeaderProps>> = () => {
  const { docs: activitySets } = useListenCollection<ActivitySet>({
    collectionId: "activity-sets",
  });

  const { queryParamState, updateQueryParams } = useTableQueryParams({
    fields: ["activity-set"],
    initialize: () => ({
      "activity-set": "",
    }),
  });

  return (
    <div>
      {activitySets && (
        <div className="flex gap-1 items-center pl-4 pt-4 pr-2">
          <Select
            className="bg-base-200 select-sm text-xs"
            name="activity-set"
            value={queryParamState["activity-set"] || ""}
            onChange={(event) =>
              updateQueryParams({ "activity-set": event.target.value })
            }
            variant="default"
          >
            {Object.values(activitySets).map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </Select>
          <Link className="btn btn-xs btn-ghost" href="/settings/activity-sets">
            <PencilIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
      {!activitySets && <div className="w-full h-6 skeleton"></div>}
    </div>
  );
};

export default ActivityMenuHeader;
