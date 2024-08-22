import React from "react";
import EnumSetter from "@/components/organisms/enum-setter/enum-setter";

type SettingsDepartmentsPageProps = {};

const SettingsDepartmentsPage: React.FC<
  Readonly<SettingsDepartmentsPageProps>
> = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="prose">
        <h2>Departments</h2>
      </div>
      <EnumSetter
        items={[
          { label: "Waterfront", id: "1" },
          { label: "Challenge Course", id: "2" },
          { label: "Equestrian", id: "3" },
        ]}
      />
    </div>
  );
};

export default SettingsDepartmentsPage;
