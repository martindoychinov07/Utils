import type {ReactNode} from "react";
import {Link} from "react-router";
import {NavLink} from "react-router-dom";

interface AppLayoutProps {
  title?: ReactNode;
  menu?: { key: string, label: ReactNode, link?: string, onClick?: () => boolean}[][];
  footer?: ReactNode;
  children: ReactNode;
}

export function MenuLayout(props: AppLayoutProps) {
  return (
    <div className="drawer h-lvh overflow-hidden">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full min-h-auto p-0">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">{props.title}</div>
          <div className="hidden lg:flex justify-between w-[calc(100%-32px)]" >
            {props.menu?.map((submenu, index) =>
              <ul key={index} className="menu menu-horizontal p-1">
                {/* Navbar menu content here */}
                {submenu.map((item, subIndex) => {
                  return (
                    <li key={subIndex}>{item.link ? <NavLink to={{pathname: item.link}} className={({ isActive }) =>
                      isActive ? "underline" : "no-underline"
                    } >{item.label}</NavLink> : <i>{item.label}</i>}</li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
        {/* Page content here */}
        <div className={"overflow-auto h-[calc(100dvh-70px)]"}>{props.children}</div>
        {props.footer}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-1">
          {/* Sidebar content here */}
          {props.menu?.flat().map((item, index) => {
            return (
              <li key={index}>{item.link ? <Link to={{pathname: item.link}}>{item.label}</Link> : <i>{item.label}</i>}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}