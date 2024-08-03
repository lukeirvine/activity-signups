import { PlusIcon } from '@heroicons/react/16/solid';
import React, { ReactNode } from 'react';
import AddWeekModal from '../../modals/add-week-modal/add-week-modal';

type SideNavProps = {
};

const SideNav: React.FC<Readonly<SideNavProps>> = () => {
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = React.useState(false);
  return <>
    <ul className="menu bg-base-200 w-56 h-full">
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
