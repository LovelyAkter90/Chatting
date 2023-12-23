import React from "react";
import "./style.css";
import { useState } from "react";
import Sidebaricons from "./Sidebaricons";
import { FiLogOut } from "react-icons/fi";
import { BiCloudUpload } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { LoginUsers } from "../../features/Slice/LoginSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Popup from "../Modal";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const users = useSelector((user) => user.login.loggedIn);
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("users");
        dispatch(LoginUsers(null));
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div className="profile-details">
            <div className="sidebar-profile" onClick={handleOpen}>
              <picture>
                {users.photoURL ? (
                  <img src={users.photoURL} alt="" />
                ) : (
                  <img src="./images/painter.png" alt="" />
                )}
              </picture>
              <div className="profile-overlay">
                <BiCloudUpload />
              </div>
            </div>
            <div className="profile-name">
              <h4>{users.displayName}</h4>
            </div>
          </div>
          <div className="other-page">
            <div className="icons-wrapper">
              <Sidebaricons />
            </div>
          </div>
          <div className="logout" onClick={handleLogout}>
            <FiLogOut />
          </div>
        </div>
        <Popup open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Sidebar;
