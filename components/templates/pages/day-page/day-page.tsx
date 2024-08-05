import { useReadCollection, useReadDoc } from '@/hooks/use-firebase';
import { Activity, Day } from '@/types/firebase-types';
import { useParams } from 'next/navigation';
import React, { ReactNode } from 'react';

type DayPageProps = {
};

const DayPage: React.FC<Readonly<DayPageProps>> = () => {
	const params = useParams();
  const { dayid, weekid } = params;
  const dayId = typeof dayid === "string" ? dayid : dayid[0];

  const { data: day, loading: dayLoading } = useReadDoc<Day>({ collectionId: `weeks/${weekid}/days`, docId: dayId });
  const { docs: activities, loading: activitiesLoading } = useReadCollection<Activity>({ collectionId: `weeks/${weekid}/days/${dayId}/activities` });

  console.log("ACTS", activities);
  
  return <div>
    {activitiesLoading && <div className="flex w-full justify-center py-8">
      <div className="loading loading-dots loading-lg"></div>
    </div>}
    {activities === undefined && <div className="py-8 prose">
      <h2>No activities</h2>  
    </div>}
  </div>;
};

export default DayPage;
