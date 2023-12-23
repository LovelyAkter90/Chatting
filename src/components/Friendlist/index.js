import React, { useEffect, useState } from "react";
import "./styl.css";
import Button from "@mui/material/Button";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendList = () => {
  const db = getDatabase();
  const [frndreq, setFrndreq] = useState([]);
  const user = useSelector((users) => users.login.loggedIn);

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
  }, [db]);

  console.log(setFrndreq);

  const handleAccept = (data) => {
    set(push(ref(db, "friends")), {
      ...data,
    }).then(() => {
      remove(ref(db, "friendrequest/" + data.id));
    });
  };

  const handleReject = (item) => {
    remove(ref(db, "friendrequest/" + item.id));
  };

  return (
    <div>
      <div className="friendrequest">
        <div className="friendreqest-header">
          <h4>Friend Request</h4>
        </div>
        {frndreq.map((item, i) => (
          <div className="friendrequest-wrapper" key={i}>
            <div className="friendrequest-image">
              <picture>
                <img
                  src={item.picture}
                  onError={(e) => {
                    e.target.src = "./images/avater.png";
                  }}
                  alt=""
                />
              </picture>
            </div>
            <div className="friendrequest-name">
              <h5>{item.sendername}</h5>
            </div>
            <div className="friendrequest-btn">
              <Button variant="contained" onClick={() => handleAccept(item)}>
                Accept
              </Button>
              <Button variant="contained" onClick={() => handleReject(item)}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
