import React from "react";

type FullPageLoadingProps = {};

const FullPageLoading: React.FC<Readonly<FullPageLoadingProps>> = () => {
  return (
    <div className="w-screen h-full flex justify-center items center">
      <div className="loading loading-dots loading-lg mb-40"></div>
    </div>
  );
};

export default FullPageLoading;
