import React from "react";
import { Activity } from "@/types/firebase-types";

type ActivityTableProps = {
  activities: {
    [key: string]: Activity;
  };
};

const ActivityTable: React.FC<Readonly<ActivityTableProps>> = ({
  activities,
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
          {Object.values(activities)
            .sort((a, b) => a.index - b.index)
            .map((activity) => {
              return (
                <tr key={activity.id}>
                  <td className={`${dataClass} text-right`}>
                    {activity.period[0]}
                    {activity.period.length > 1
                      ? `-${activity.period[activity.period.length - 1]}`
                      : ""}
                  </td>
                  <td className={`${dataClass}`}>{activity.name}</td>
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
