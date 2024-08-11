import Link from "next/link";
import React from "react";

type NavbarProps = {};

const Navbar: React.FC<Readonly<NavbarProps>> = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost">
          <p className="text-xl">Activity Signups</p>
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal">
          <li>
            <Link href="/auth/login">Log In</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
