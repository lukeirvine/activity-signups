import Link from "next/link";
import React from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { getInitials } from "@/helpers/utils";
import { useCurrentUser } from "@/hooks/use-user";
import Button from "@/components/atoms/buttons/button/button";
import { useSignOut } from "@/hooks/use-firebase";

type NavbarProps = {};

const Navbar: React.FC<Readonly<NavbarProps>> = () => {
  const user = useCurrentUser();
  const { signOutUser, loading: loadingSignOut } = useSignOut();

  return (
    <div className="navbar bg-base-100 py-0">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost">
          <p className="text-xl">Activity Signups</p>
        </Link>
      </div>
      <div className="navbar-end">
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
                <li>
                  <Button
                    variant="none"
                    onClick={signOutUser}
                    loading={loadingSignOut}
                    disabled={loadingSignOut}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
