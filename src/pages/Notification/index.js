import React, { useEffect, useState } from "react";
import "./style.css";
import Grid from "@mui/material/Grid";
import { AiFillBell } from "react-icons/ai";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { getDatabase, onValue, push, ref, set } from "firebase/database";

const Notification = () => {
  const db = getDatabase();

  const [frndreq, setFrndreq] = useState([]);

  const user = useSelector((users) => users.login.loggedIn);

  const handlesentRequest = (item) => {
    set(push(ref(db, "friendrequest")), {
      sendername: user.displayName,
      senderid: user.uid,
      recievername: item.username,
      recieverid: item.id,
      picture: user.photoURL,
      reciverpicture: item.profilePicture,
    });
    console.log("ase");
  };
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      let reqArr = [];
      snapshot.forEach((item) => {
        if (item.val().recieverid == user.uid) {
          reqArr.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setFrndreq(reqArr);
    });
  }, []);

  //////for group message show

  return (
    <div>
      <div className="notification-main">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            {frndreq.length == 0 ? (
              <Alert severity="error" className="notify-alert">
                Notification Is Empty!
              </Alert>
            ) : (
              frndreq.map((item, i) => (
                <div className="notification-info" key={i}>
                  <div className="notifi-icon">
                    <AiFillBell onClick={(item) => handlesentRequest(item)} />
                  </div>
                  <div className="notifi-text">
                    <h4>
                      Friend Request Send By <span>{item.sendername}</span>
                    </h4>
                  </div>
                </div>
              ))
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Notification;
