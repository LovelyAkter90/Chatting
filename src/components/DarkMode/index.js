import React from "react";
import "./style.css";
import Switch from "@mui/material/Switch";

const Darkmode = () => {
  return (
    <div>
      <div className="theme-part">
        <Switch defaultChecked />
      </div>
    </div>
  );
};

export default Darkmode;
