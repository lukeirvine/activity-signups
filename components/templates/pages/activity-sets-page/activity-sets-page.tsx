import React from "react";
import uuid from "react-uuid";
import EnumSetter from "@/components/organisms/enum-setter/enum-setter";
import { useListenCollection } from "@/hooks/use-firebase";
import { ActivitySet } from "@/types/firebase-types";

type ActivitySetsPageProps = {};

const ActivitySetsPage: React.FC<Readonly<ActivitySetsPageProps>> = () => {
  const { docs: sets } = useListenCollection<ActivitySet>({
    collectionId: "activity-sets",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="prose">
        <h2>Activity Sets</h2>
      </div>
      <div className="max-w-96">
        <EnumSetter<ActivitySet>
          items={Object.values(sets || {}).map((set) => ({
            id: set.id || uuid(),
            label: set.name,
          }))}
          collectionId="activity-sets"
          addLabel="Add Activity Set"
          confirmationTitle="Save Changes"
          confirmationMessage="Are you sure you want to make these changes? All activities and occurrences associated with removed activity sets will be deleted."
        />
      </div>
      <div className="prose">
        <p>
          These are groups of activity definitions. They are well suited for
          saving different activities for different weeks or years.
        </p>
      </div>
    </div>
  );
};

export default ActivitySetsPage;
