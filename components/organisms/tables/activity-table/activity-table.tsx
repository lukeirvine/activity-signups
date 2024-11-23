import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/16/solid";
import {
  Activities,
  Departments,
  Occurrence,
  Occurrences,
} from "@/types/firebase-types";
import { deleteDoc } from "@/helpers/firebase";

type ActivityTableProps = {
  activities: Activities;
  occurrences: Occurrences;
  departments: Departments;
};

const ActivityTable: React.FC<Readonly<ActivityTableProps>> = ({
  activities,
  occurrences,
  departments,
}) => {
  const dataClass = "whitespace-nowrap";

  const handleDeleteActivity = async (occurrence: Occurrence) => {
    if (occurrence.id) {
      await deleteDoc({
        collectionId: `weeks/${occurrence.weekId}/days/${occurrence.dayId}/occurrences`,
        docId: occurrence.id,
      });
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
            <th>Period</th>
            <th>Name</th>
            <th>Department</th>
            <th>Cost</th>
            <th>Highlighted Text</th>
            <th>Headcount</th>
            <th>Secondary Headcount Name</th>
            <th>Secondary Headcount</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(occurrences).map((occurrence) => {
            const activity = activities[occurrence.activityId];
            return (
              <tr key={activity.id}>
                <td>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleDeleteActivity(occurrence)}
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </td>
                <td className={`${dataClass} text-right`}>
                  {occurrence.period[0]}
                  {occurrence.period.length > 1
                    ? `-${occurrence.period[occurrence.period.length - 1]}`
                    : ""}
                </td>
                <td className={`${dataClass}`}>
                  <Link
                    className="hover:underline"
                    href={`/activities/${activity.id}`}
                  >
                    {activity.name}
                  </Link>
                </td>
                <td className={`${dataClass}`}>
                  {departments[activity.department].name}
                </td>
                <td className={`${dataClass} text-right`}>
                  {activity.cost || "--"}
                </td>
                <td className={`${dataClass}`}>
                  {activity.highlightedText || "First & Last Name"}
                </td>
                <td className={`${dataClass} text-right`}>
                  {activity.headcount}
                </td>
                <td className={`${dataClass}`}>
                  {activity.secondaryHeadcountName || "--"}
                </td>
                <td className={`${dataClass} text-right`}>
                  {activity.secondaryHeadcount}
                </td>
                <td className={`${dataClass}`}>
                  {activity.notes.map((note, index) => (
                    <div key={index}>{note}</div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
