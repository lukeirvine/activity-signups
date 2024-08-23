import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { convertDateToDay } from "@/helpers/utils";
import { FirebaseCollection } from "@/hooks/use-firebase";
import { Day } from "@/types/firebase-types";

type TabNavProps = {
  days: FirebaseCollection<Day> | undefined | null;
};

const TabNav: React.FC<Readonly<TabNavProps>> = ({ days }) => {
  const router = useRouter();
  const params = useParams();
  const { weekid, dayid } = params;
  console.log("TAB NAV", weekid, dayid);

  useEffect(() => {
    if (dayid === undefined && days && Object.values(days).length > 0) {
      router.push(
        `/${weekid}/${Object.values(days || {}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.id}`,
      );
    }
  }, [weekid, dayid, days, router]);

  return (
    <div className="flex">
      {days && (
        <div role="tablist" className="tabs tabs-bordered">
          {Object.values(days)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .map((day, index) => (
              <Link
                key={index}
                role="tab"
                className={`tab ${day.id === dayid ? "tab-active" : ""}`}
                href={`/weeks/${weekid}/${day.id}`}
              >
                {convertDateToDay(new Date(day.date))}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default TabNav;
