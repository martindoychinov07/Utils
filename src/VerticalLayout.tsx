import type {ReactNode} from "react";
import {NavLink, Outlet} from "react-router-dom";
import {useI18n} from "../context/i18n/useI18n.tsx";

interface AppLayoutProps {
  title?: ReactNode;
  menu?: { key: string, label: ReactNode, link?: string, onClick?: () => boolean}[][];
  footer?: ReactNode;
  children: ReactNode;
}

export function VerticalLayout(props: AppLayoutProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between bg-base-200 text-black p-0">
        {props.menu?.map((submenu, index) =>
          <ul key={index} className="menu menu-horizontal p-1">
            {/* Navbar menu content here */}
            {submenu.map((item, subIndex) => {
              if (item.key === "home") {
                return <li key={subIndex} className={"m-1"}>
                  <NavLink to={{pathname: item.link}}>
                    <div className="tooltip tooltip-bottom" data-tip={t("~home.tooltip")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-[1.5em]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </NavLink>
                </li>
              }
              return (
                <li key={subIndex}>
                  <NavLink
                    to={{pathname: item.link}}
                    className={({ isActive }) => isActive ? "menu-active m-1" : "m-1"}
                  >{item.label}</NavLink>
                </li>
              )
            })}
          </ul>
        )}
      </header>
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-100 p-0">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-2">
        {props.footer}
      </footer>
    </div>
  )
}