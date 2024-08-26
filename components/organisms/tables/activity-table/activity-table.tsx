import React from "react";
import Link from "next/link";
import { Activities, Occurrences } from "@/types/firebase-types";

type ActivityTableProps = {
  activities: Activities;
  occurrences: Occurrences;
};

const ActivityTable: React.FC<Readonly<ActivityTableProps>> = ({
  activities,
  occurrences,
}) => {
  const dataClass = "whitespace-nowrap";

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs">
        <thead>
          <tr>
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
                <td className={`${dataClass}`}>{activity.department}</td>
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
