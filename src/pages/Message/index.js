import React from "react";
import "./style.css";
import Grid from "@mui/material/Grid";
import Messaggruope from "../../components/mesggrp";
import Friends from "../../components/Friends";
import Talking from "../../components/Talking";
import Lottie from "lottie-react";
import loading from "../../svg/loading";

const Message = () => {
  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item xs={4} className="message-items">
          <div className="message-left">
            <Messaggruope />
            <Friends />
          </div>
        </Grid>
        <Grid item xs={7.5}>
          <div className="message-right">
            <Talking />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
