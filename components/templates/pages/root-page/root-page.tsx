"use client";

import Navbar from '@/components/organisms/nav/navbar/navbar';
import SideNav from '@/components/organisms/nav/side-nav/side-nav';
import React, { ReactNode } from 'react';

type RootPageProps = {
	children: ReactNode;
};

const RootPage: React.FC<Readonly<RootPageProps>> = ({ children }) => {
	return <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow flex">
      <div>
        <SideNav />
      </div>
      <div className="flex-grow">
        <div className="bg-base-100 h-full">
          {children}
        </div>
      </div>
    </div>
  </div>

};

export default RootPage;
