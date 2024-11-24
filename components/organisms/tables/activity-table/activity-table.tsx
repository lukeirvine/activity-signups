import React, { useState } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/16/solid";
import {
  Activities,
  Departments,
  Occurrence,
  Occurrences,
} from "@/types/firebase-types";
import { deleteDoc } from "@/helpers/firebase";
import useTableQueryParams from "@/hooks/use-table-query-params";

type SortOption = "period" | "name" | "department";

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
  const {
    queryParamState: state,
    updateQueryParams,
  } = useTableQueryParams({
    fields: ["sortBy"],
    initialize: () => ({ sortBy: "period" }),
  })

  const dataClass = "whitespace-nowrap";

  const handleDeleteOccurrence = async (occurrence: Occurrence) => {
    if (occurrence.id) {
      await deleteDoc({
        collectionId: `weeks/${occurrence.weekId}/days/${occurrence.dayId}/occurrences`,
        docId: occurrence.id,
      });
    }
  };

  const sortedOccurrences = Object.values(occurrences).sort((a, b) => {
    const activityA = activities[a.activityId];
    const activityB = activities[b.activityId];
    const departmentA = departments[activityA.department].name;
    const departmentB = departments[activityB.department].name;

    const sortByPeriod = () => {
      return a.period[0] - b.period[0];
    }
    const sortByDepartment = () => {
      return departmentA.localeCompare(departmentB);
    }
    const sortByName = () => {
      return activityA.name.localeCompare(activityB.name);
    }

    if (state.sortBy === "department") {
      if (departmentA !== departmentB) {
        return sortByDepartment();
      }
      if (a.period[0] !== b.period[0]) {
        return sortByPeriod();
      }
      return sortByName();
    }

    if (state.sortBy === "name") {
      if (activityA.name !== activityB.name) {
        return sortByName();
      }
      if (a.period[0] !== b.period[0]) {
        return sortByPeriod();
      }
      return sortByDepartment();
    }

    if (a.period[0] !== b.period[0]) {
      return sortByPeriod();
    }
    if (departmentA !== departmentB) {
      return sortByDepartment();
    }
    return sortByName();
  });

  type SortOptionData = {
    value: SortOption;
    label: string;
  }
  const sortOptions: Record<SortOption, SortOptionData> = {
    period: { value: "period", label: "Period" },
    name: { value: "name", label: "Name" },
    department: { value: "department", label: "Department" },
  }

  return (
    <div>
      <div>
        <label className="text-xs mr-2">Sort by:</label>
        <select
          className="select select-xs text-xs pt-1 pb-1 mb-2"
          value={state.sortBy || ''}
          onChange={(e) => updateQueryParams({ sortBy: e.target.value })}
        >
          <option disabled>Sort by</option>
          {Object.values(sortOptions).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
            {Object.values(sortedOccurrences).map((occurrence) => {
              const activity = activities[occurrence.activityId];
              return (
                <tr key={occurrence.id}>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDeleteOccurrence(occurrence)}
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
    </div>
  );
};

export default ActivityTable;
