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
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Name</th>
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
                  <td>
                    {activity.period[0]}
                    {activity.period.length > 1
                      ? `-${activity.period[activity.period.length - 1]}`
                      : ""}
                  </td>
                  <td>{activity.name}</td>
                  <td>{activity.headcount}</td>
                  <td>{activity.secondaryHeadcountName}</td>
                  <td>{activity.secondaryHeadcount}</td>
                  <td>{activity.notes}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
