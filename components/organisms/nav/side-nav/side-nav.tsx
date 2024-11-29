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
};

const SideNav: React.FC<Readonly<SideNavProps>> = ({
  groups,
  items,
  actionButton,
}) => {
  // get pathname
  const pathname = usePathname();

  return (
    <>
      <ul className="menu bg-base-200 w-56 h-full">
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
        <div className="text-base-content">{actionButton}</div>
      </ul>
    </>
  );
};

export default SideNav;
