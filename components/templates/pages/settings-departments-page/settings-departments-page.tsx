import React from "react";
import uuid from "react-uuid";
import EnumSetter from "@/components/organisms/enum-setter/enum-setter";
import { useListenCollection } from "@/hooks/use-firebase";
import { Department } from "@/types/firebase-types";

type SettingsDepartmentsPageProps = {};

const SettingsDepartmentsPage: React.FC<
  Readonly<SettingsDepartmentsPageProps>
> = () => {
  const { docs: depts, loading: deptsLoading } =
    useListenCollection<Department>({
      collectionId: "departments",
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="prose">
        <h2>Departments</h2>
      </div>
      <div className="max-w-96">
        <EnumSetter<Department>
          items={Object.values(depts || {}).map((dept) => ({
            id: dept.id || uuid(),
            label: dept.name,
          }))}
          collectionId="departments"
          addLabel="Add Department"
          confirmationTitle="Save Changes"
          confirmationMessage="Are you sure you want to make these changes? All activities and occurrences associated with removed departments will be deleted."
        />
      </div>
    </div>
  );
};

export default SettingsDepartmentsPage;
