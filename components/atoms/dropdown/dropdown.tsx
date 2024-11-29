import clsx from "clsx";
import React, { ReactNode } from "react";

type Item = {
  label: string;
  onClick: () => void;
  loading?: boolean;
};

type DropdownProps = {
  button: ReactNode;
  items: Item[];
  align?: "left" | "right";
};

const Dropdown: React.FC<Readonly<DropdownProps>> = ({
  button,
  items,
  align = "left",
}) => {
  return (
    <div className={clsx("dropdown", align === "right" && "dropdown-end")}>
      <div tabIndex={0} role="button">
        {button}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-base-content ring-1 ring-base-300"
      >
        {items.map((item, index) => (
          <li key={index}>
            {item.loading && (
              <div className="loading loading-spinner loading-xs"></div>
            )}
            {!item.loading && (
              <button onClick={item.onClick}>{item.label}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
