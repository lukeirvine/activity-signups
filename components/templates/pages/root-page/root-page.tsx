"use client";

import React, { ReactNode } from "react";
import Navbar from "@/components/organisms/nav/navbar/navbar";

type RootPageProps = {
  children: ReactNode;
};

const RootPage: React.FC<Readonly<RootPageProps>> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 w-screen" style={{ zIndex: "100" }}>
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default RootPage;
