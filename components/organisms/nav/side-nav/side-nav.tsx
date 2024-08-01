import { PlusIcon } from '@heroicons/react/16/solid';
import React, { ReactNode } from 'react';

type SideNavProps = {
};

const SideNav: React.FC<Readonly<SideNavProps>> = () => {
  return <ul className="menu bg-base-200 w-56 h-full">
    <li>
      <button className="btn btn-ghost">
        <PlusIcon className="w-5 h-5" />
        Add Week
      </button>
    </li>
  </ul>
};

export default SideNav;
