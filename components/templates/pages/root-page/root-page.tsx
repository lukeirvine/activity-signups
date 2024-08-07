"use client";

import React, { ReactNode } from "react";
import Navbar from "@/components/organisms/nav/navbar/navbar";
import SideNav from "@/components/organisms/nav/side-nav/side-nav";

type RootPageProps = {
  children: ReactNode;
};

const RootPage: React.FC<Readonly<RootPageProps>> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 w-screen" style={{ zIndex: "100" }}>
        <Navbar />
      </div>
      <div className="h-screen pt-16 bg-base-100">
        <div className="fixed top-0 left-0 h-screen pt-16">
          <SideNav />
        </div>
        <div className="h-full pl-56">{children}</div>
      </div>
    </div>
  );
};

export default RootPage;
