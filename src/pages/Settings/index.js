import React from "react";
import "./style.css";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SettingForm from "./SettingForm";
import Darkmode from "../../components/DarkMode";

const Settings = () => {
  const users = useSelector((user) => user.login.loggedIn);
  return (
    <div>
      <div className="main-account-info">
        <div className="theme">
          <Darkmode />
        </div>
        <Grid container justifyContent="center">
          <div className="account">
            <div className="acconut-info">
              <div className="profile-picture">
                <picture>
                  <img src={users.photoURL} alt="" loading="lazy" />
                </picture>
              </div>
            </div>
            <div className="setting-from">
              <SettingForm />
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Settings;
