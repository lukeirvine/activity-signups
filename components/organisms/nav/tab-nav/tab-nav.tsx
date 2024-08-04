import React, { ReactNode } from 'react';

type TabNavProps = {
};

const TabNav: React.FC<Readonly<TabNavProps>> = () => {
	return <div className="flex">
    <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className={`tab`}>Tab 1</a>
        <a role="tab" className={`tab`}>Tab 2</a>
        <a role="tab" className={`tab`}>Tab 3</a>
      </div>
  </div>
};

export default TabNav;
