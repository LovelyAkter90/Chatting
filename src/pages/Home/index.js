import React from "react";
import Grid from "@mui/material/Grid";
import "./style.css";
import Searchbox from "../../components/Searchbox";
import Gruoplist from "../../components/Grouplists";
import FriendList from "../../components/Friendlist";
import Friends from "../../components/Friends";
import MyGroupList from "../../components/MyGroup";
import Userlist from "../../components/UserList";
import BlockUsers from "../../components/Blockusers";

const Home = () => {
  return (
    <>
      <div className="home-pages">
        <Grid container>
          <Grid item xs={4} className="home-items">
            <div className="home-left">
              <Searchbox />
              <div>
                <Gruoplist />
                <FriendList />
              </div>
            </div>
          </Grid>
          <Grid item xs={4} className="home-items">
            <div className="home-mid">
              <Friends />
              <MyGroupList />
            </div>
          </Grid>
          <Grid item xs={4} className="home-items">
            <div className="honme-right">
              <Userlist />
              <BlockUsers />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Home;
