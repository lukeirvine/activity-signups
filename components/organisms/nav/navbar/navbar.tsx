import Link from "next/link";
import React, { ReactNode } from "react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getInitials } from "@/helpers/utils";
import { useCurrentUser } from "@/hooks/use-user";
import Button from "@/components/atoms/buttons/button/button";
import { useSignOut } from "@/hooks/use-firebase";

type NavbarProps = {};

const Navbar: React.FC<Readonly<NavbarProps>> = () => {
  const user = useCurrentUser();
  const { signOutUser, loading: loadingSignOut } = useSignOut();

  // const links = <>
  //   <li>
  //     <Link href="/activities" onClick={onDrawerNavClick}>Activities</Link>
  //   </li>
  //   <li>
  //     <Link href="/settings" onClick={onDrawerNavClick}>Settings</Link>
  //   </li>
  // </>;

  const onDrawerNavClick = () => {
    const drawer = document.getElementById("my-drawer");
    if (drawer) {
      drawer.click();
    }
  };

  const links = [
    {
      href: "/activities",
      text: "Activities",
    },
    {
      href: "/settings",
      text: "Settings",
    },
  ];

  const logoutButton = (
    <Button
      variant="none"
      onClick={signOutUser}
      loading={loadingSignOut}
      disabled={loadingSignOut}
    >
      Logout
    </Button>
  );

  return (
    <div className="navbar bg-base-100 py-0">
      <div className="navbar-start flex-grow w-full">
        <Link href="/" className="btn btn-ghost">
          <p className="text-xl">Activity Signups</p>
        </Link>
        <div className="hidden flex-none sm:block">
          <ul className="menu menu-horizontal w-full">
            {user &&
              links.map((link, index) => (
                <NavLink key={index} href={link.href}>
                  {link.text}
                </NavLink>
              ))}
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <div className="sm:hidden">
          <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <Bars3Icon className="w-6 h-6" />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <div className="w-full flex justify-end">
                  <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </label>
                </div>
                <NavLink href="/" onClick={onDrawerNavClick}>
                  Home
                </NavLink>
                {links.map((link, index) => (
                  <NavLink
                    key={index}
                    href={link.href}
                    onClick={onDrawerNavClick}
                  >
                    {link.text}
                  </NavLink>
                ))}
                <li onClick={onDrawerNavClick}>{logoutButton}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <ul className="menu menu-horizontal">
            {user === null && <div className="skeleton w-20 h-8"></div>}
            {user === undefined && (
              <li>
                <Link href="/auth/login">Log In</Link>
              </li>
            )}
            {user && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar placeholder btn btn-circle btn-ghost"
                >
                  <div className="bg-neutral text-neutral-content w-8 rounded-full">
                    <span className="text-xs">
                      {user.displayName ? (
                        getInitials(user.displayName)
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>{logoutButton}</li>
                </ul>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  return (
    <li>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </li>
  );
};

export default Navbar;
