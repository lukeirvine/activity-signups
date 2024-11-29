import React from "react";
import uuid from "react-uuid";
import EnumSetter, {
  Item as EnumItem,
} from "@/components/organisms/enum-setter/enum-setter";
import { useListenCollection } from "@/hooks/use-firebase";
import { Department } from "@/types/firebase-types";
import { deleteDoc, setCollection, updateDoc } from "@/helpers/firebase";

type SettingsDepartmentsPageProps = {};

const SettingsDepartmentsPage: React.FC<
  Readonly<SettingsDepartmentsPageProps>
> = () => {
  const { docs: depts, loading: deptsLoading } =
    useListenCollection<Department>({
      collectionId: "departments",
    });

  const saveDepartments = async (items: EnumItem[]) => {
    // array of items that already exist
    const existingItems = items.filter((item) => depts?.[item.id]);
    // array of items that are new
    const newItems = items.filter((item) => !depts?.[item.id]);
    // array of items that have been removed
    const removedKeys = Object.keys(depts || {}).filter(
      (key) => !items.find((item) => item.id === key),
    );

    // update existing items
    await Promise.all(
      existingItems.map((item) =>
        updateDoc<Department>({
          collectionId: "departments",
          docId: item.id,
          data: { name: item.label },
        }),
      ),
    );
    // add new items
    await setCollection<Department>({
      collectionId: "departments",
      data: newItems.map((item) => ({
        id: item.id,
        name: item.label,
      })),
    });
    // remove removed items
    await Promise.all(
      removedKeys.map((key) =>
        deleteDoc({ collectionId: "departments", docId: key }),
      ),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="prose">
        <h2>Departments</h2>
      </div>
      <div className="max-w-96">
        <EnumSetter
          items={Object.values(depts || {}).map((dept) => ({
            id: dept.id || uuid(),
            label: dept.name,
          }))}
          onSetItems={saveDepartments}
          addLabel="Add Department"
          confirmationTitle="Save Changes"
          confirmationMessage="Are you sure you want to make these changes? All activities and occurrences associated with removed departments will be deleted."
        />
      </div>
    </div>
  );
};

export default SettingsDepartmentsPage;
