import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import {
  onValue,
  getDatabase,
  ref,
  push,
  set,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
const BlockUsers = () => {
  const db = getDatabase();
  const [blocklsit, setBlockList] = useState([]);
  const user = useSelector((users) => users.login.loggedIn);

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let blockArr = [];
      snapshot.forEach((item) => {
        if (item.val().blockedbyid == user.uid) {
          blockArr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          blockArr.push({
            id: item.key,
            blockedby: item.val().blockedby,
            blockedbyid: item.val().blockedbyid,
          });
        }
      });
      setBlockList(blockArr);
    });
  }, []);

  //for unblock friends

  const handleUnBlock = (item) => {
    set(push(ref(db, "users")), {
      sendername: item.block,
      senderid: item.blockid,
      recievername: user.displayName,
      recieverid: user.uid,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };

  return (
    <>
      <div className="blockuser">
        <div className="blockuser-header">
          <h4>Blocked Users</h4>
        </div>

        {blocklsit.length == 0 ? (
          <Alert severity="info">No Block Users Yet!</Alert>
        ) : (
          blocklsit.map((item, i) => (
            <div className="blockuser-wrapper" key={i}>
              <div className="blockuser-image">
                <picture>
                  <img src={item.profilePicture} alt="" />
                </picture>
              </div>
              <div className="blockuser-content">
                <h4>{item.block}</h4>
                <h4>{item.blockedby}</h4>
                <p>Sure?</p>
              </div>
              {!item.blockedbyid && (
                <div className="blockuser-btn">
                  <Button
                    variant="contained"
                    onClick={() => handleUnBlock(item)}
                  >
                    UnBlock
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default BlockUsers;
