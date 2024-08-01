import Modal, { showModal } from '@/components/atoms/modal/modal';
import { PlusIcon } from '@heroicons/react/16/solid';
import React, { ReactNode } from 'react';
import AddWeekModal from '../../modals/add-week-modal/add-week-modal';

type SideNavProps = {
};

const SideNav: React.FC<Readonly<SideNavProps>> = () => {
  return <>
    <ul className="menu bg-base-200 w-56 h-full">
      <li>
        <button className="btn btn-ghost" onClick={() => showModal("add_week_modal")}>
          <PlusIcon className="w-5 h-5" />
          Add Week
        </button>
      </li>
    </ul>
    <AddWeekModal id="add_week_modal" />
  </>
};

export default SideNav;
