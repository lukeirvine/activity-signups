import React from "react";

type ActivitySetsPageProps = {};

const ActivitySetsPage: React.FC<Readonly<ActivitySetsPageProps>> = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="prose">
        <h2>Activity Sets</h2>
        <p>
          These are groups of activity definitions. They are well suited for
          saving different activities for different weeks or years.
        </p>
      </div>
      <div className="max-w-96"></div>
    </div>
  );
};

export default ActivitySetsPage;
