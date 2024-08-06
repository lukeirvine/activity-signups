import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { convertDateToDay } from "@/helpers/utils";
import { useListenCollection } from "@/hooks/use-firebase";
import { Day } from "@/types/firebase-types";

type TabNavProps = {};

const TabNav: React.FC<Readonly<TabNavProps>> = () => {
  const router = useRouter();
  const params = useParams();
  const { weekid, dayid } = params;
  console.log("TAB NAV", weekid, dayid);

  const { docs: days, loading: daysLoading } = useListenCollection<Day>({
    collectionId: `weeks/${weekid}/days`,
  });

  useEffect(() => {
    if (dayid === undefined && days && Object.values(days).length > 0) {
      router.push(`/${weekid}/${Object.values(days || {})[0]?.id}`);
    }
  }, [weekid, dayid, days, router]);

  return (
    <div className="flex">
      {days && (
        <div role="tablist" className="tabs tabs-bordered">
          {Object.values(days)
            .sort((a, b) => parseInt(a.date) - parseInt(b.date))
            .map((day, index) => (
              <Link
                key={index}
                role="tab"
                className={`tab ${day.id === dayid ? "tab-active" : ""}`}
                href={`/${weekid}/${day.id}`}
              >
                {convertDateToDay(new Date(parseInt(day.date)))}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default TabNav;
