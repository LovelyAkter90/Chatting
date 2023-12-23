import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebaricons = () => {
  return (
    <div className="icons-wrapper">
      <NavLink className="sidebar-icons" to="/">
        <AiOutlineHome />
      </NavLink>
      <NavLink className="sidebar-icons" to="/message">
        <BsFillChatDotsFill />
      </NavLink>
      <NavLink className="sidebar-icons" to="/notification">
        <BsBellFill />
      </NavLink>
      <NavLink className="sidebar-icons" to="/settings">
        <FiSettings />
      </NavLink>
    </div>
  );
};

export default Sidebaricons;
