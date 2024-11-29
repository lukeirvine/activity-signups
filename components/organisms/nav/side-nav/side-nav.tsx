import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
};

type SideNavProps = {
  items?: Item[];
  actionButton?: React.ReactNode;
};

const SideNav: React.FC<Readonly<SideNavProps>> = ({ items, actionButton }) => {
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
              <ul></ul>
            </li>
          ))}
        {items === undefined && (
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
