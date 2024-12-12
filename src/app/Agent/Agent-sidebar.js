"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import classNames from "classnames";
import { FaHandsHelping } from "react-icons/fa";
import { MdEdit, MdEvent, MdLoyalty, MdPeople, MdStar } from "react-icons/md";

const menuItems = [
  {
    id: 1,
    label: "Edit Listing",
    icon: MdEdit,
    link: "/agent-listing",
    isChecked: true,
  },
  {
    id: 9,
    label: "Edit Profile",
    icon: MdEdit,
    link: "/agentProfile",
    isChecked: true,
  },
  { id: 2, label: "Event", icon: MdEvent, link: "/agentevent" },
  {
    id: 3,
    label: "Incentives",
    icon: MdLoyalty,
    link: "/agent-incentives",
  },
  {
    id: 4,
    label: "Connections",
    icon: MdPeople,
    link: "/agent-connections",
  },
  { id: 5, label: "Sponsors", icon: FaHandsHelping, link: "/agent-sponsors" },

  {
    id: 8,
    label: "Featured Listing",
    icon: MdStar,
    link: "/agent-featured-listing",
  },
];

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);

  const router = useRouter();

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  );

  const getNavItemClasses = (menu) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded overflow-hidden whitespace-nowrap",
      {
        "bg-light-lighter": activeMenu?.id === menu.id,
      }
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg m-2 h-full">
      <div className="flex flex-col items-start p-4">
        {menuItems.map(({ icon: Icon, ...menu }) => {
          const classes = getNavItemClasses(menu);
          return (
            <div key={menu.id} className={classes}>
              <Link className="flex py-3 items-center" href={menu.link}>
                <div style={{ width: "2rem" }}>
                  <Icon size={24} />
                </div>
                {!toggleCollapse && (
                  <span
                    className={classNames(
                      "text-md font-medium text-text-light"
                    )}
                  >
                    {menu.label}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
