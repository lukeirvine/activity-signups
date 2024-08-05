import { PlusIcon } from '@heroicons/react/16/solid';
import React, { ReactNode } from 'react';
import AddWeekModal from '../../modals/add-week-modal/add-week-modal';
import { useListenCollection, useReadCollection } from '@/hooks/use-firebase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Week } from '@/types/firebase-types';

type SideNavProps = {
};

const SideNav: React.FC<Readonly<SideNavProps>> = () => {
  const { docs: weeks, loading: weeksLoading } = useListenCollection<Week>({ collectionId: 'weeks' });
  const params = useParams();
  const { weekid: weekId } = params;
  console.log("SIDE NAV", weekId);
  
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = React.useState(false);
  return <>
    <ul className="menu bg-base-200 w-56 h-full">
      {weeks && Object.values(weeks).map((week, i) => {
        return <li key={i}>
          <Link href={`/${week.id}`} className={`${week.id === weekId ? "active" : ""}`}>{week.name}</Link>
          <ul>
            
          </ul>
        </li>
      })}
      {weeksLoading && <div className="flex justify-center w-full">
        <div className="loading loading-spinner loading-sm"></div>
      </div>}
      <li>
        <button className="btn btn-ghost" onClick={() => setIsAddWeekModalOpen(true)}>
          <PlusIcon className="w-5 h-5" />
          Add Week
        </button>
      </li>
    </ul>
    <AddWeekModal 
      isOpen={isAddWeekModalOpen}
      onClose={() => setIsAddWeekModalOpen(false)}
    />
  </>
};

export default SideNav;
