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
import { useDispatch, useSelector } from "react-redux";
import { Activesingel } from "../../features/Slice/ActiveSingelSlice";

const Friends = () => {
  const db = getDatabase();
  const user = useSelector((users) => users.login.loggedIn);
  const dispatch = useDispatch();
  const [frnlist, setFrendlist] = useState([]);
  const activeChatName = useSelector((active) => active.active.active);
  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      const frndArr = [];
      snapshot.forEach((item) => {
        if (
          user.uid == item.val().recieverid ||
          user.uid == item.val().senderid
        ) {
          frndArr.push({ ...item.val(), id: item.key });
        }
      });
      setFrendlist(frndArr);
    });
  }, []);

  // for block users list

  const handleBlock = (item) => {
    if (user.uid == item.senderid) {
      set(push(ref(db, "block")), {
        block: item.recievername,
        blockid: item.recieverid,
        blockedby: item.sendername,
        blockedbyid: item.senderid,
      }).then(() => {
        remove(ref(db, "friends/" + item.senderid));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sendername,
        blockid: item.senderid,
        blockedby: item.recievername,
        blockedbyid: item.recieverid,
      }).then(() => {
        remove(ref(db, "friends/" + item.id));
      });
    }
  };

  //unfriend list er jonno

  const handleUnFriend = (item) => {
    remove(ref(db, "friends/" + item.id));
    console.log(item);
  };

  ///for Active friends

  const handleActiveSingel = (item) => {
    if (item.recieverid == user.uid) {
      dispatch(
        Activesingel({
          status: "singel",
          id: item.senderid,
          name: item.sendername,
        })
      );
      localStorage.setItem("ActiveSingle", JSON.stringify(activeChatName));
    } else {
      dispatch(
        Activesingel({
          status: "singel",
          id: item.recieverid,
          name: item.recievername,
        })
      );
      localStorage.setItem("ActiveSingle", JSON.stringify(activeChatName));
    }
  };
  return (
    <>
      <div>
        <div className="friend-part">
          <div className="friend-part-header">
            <h4>Friends</h4>
          </div>
          {frnlist.map((item, i) => (
            <div
              className="friend-part-wrapper"
              key={i}
              onClick={() => handleActiveSingel(item)}
            >
              <div className="friend-part-image">
                <picture>
                  <img src={item.picture} alt="" />
                </picture>
              </div>
              <div className="friend-part-content">
                <h4>
                  {user.uid == item.senderid
                    ? item.recievername
                    : item.sendername}
                </h4>
              </div>
              <div className="friend-btn">
                <Button variant="contained" onClick={() => handleBlock(item)}>
                  Block
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleUnFriend(item)}
                >
                  Unfriend
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Friends;
