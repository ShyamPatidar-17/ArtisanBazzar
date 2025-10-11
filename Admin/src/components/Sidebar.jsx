import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  PlusCircle,
  List,
  ShoppingBag,
  MessageSquareText,
  UserCircle2, // Import icon for profile
} from "lucide-react";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l hover:bg-gray-100 transition-all duration-200";

  return (
    <div className="w-[18%] min-h-screen border-r-2 bg-white">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px] font-medium text-gray-700">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <Home size={20} />
          <p>Home</p>
        </NavLink>


         <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <UserCircle2 size={20} />
          <p>Profile</p>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <PlusCircle size={20} />
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <List size={20} />
          <p>List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <ShoppingBag size={20} />
          <p>Orders</p>
        </NavLink>

        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}`
          }
        >
          <MessageSquareText size={20} />
          <p>Chat with Customers</p>
        </NavLink>

       


      </div>
    </div>
  );
};

export default Sidebar;
