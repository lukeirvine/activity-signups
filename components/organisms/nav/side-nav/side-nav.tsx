import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Group = {
  title?: string;
  items: Item[];
};

type Item = {
  label: string;
  href: string;
};

type SideNavProps = {
  groups?: Group[];
  items?: Item[];
  actionButton?: React.ReactNode;
  header?: React.ReactNode;
};

const SideNav: React.FC<Readonly<SideNavProps>> = ({
  groups,
  items,
  actionButton,
  header,
}) => {
  // get pathname
  const pathname = usePathname();

  return (
    <>
      <div className="bg-base-200 h-full flex flex-col">
        <div>{header}</div>
        <ul className="menu w-56 flex-nowrap overflow-auto pb-10">
          {items &&
            items.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className={`${pathname.includes(item.href) ? "active" : ""} text-base-content`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          {groups &&
            groups.map((group, i) => (
              <li key={i}>
                {group.title && <h2 className="menu-title">{group.title}</h2>}
                <ul>
                  {group.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        href={item.href}
                        className={`${pathname.includes(item.href) ? "active" : ""} text-base-content`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          {items === undefined && groups === undefined && (
            <div className="flex justify-center w-full">
              <div className="loading loading-spinner loading-sm"></div>
            </div>
          )}
          <li className="text-base-content">{actionButton}</li>
        </ul>
      </div>
    </>
  );
};

export default SideNav;
