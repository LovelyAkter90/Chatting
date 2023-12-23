import React, { useState, useEffect } from "react";
import "./style.css";
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
import Alert from "@mui/material/Alert";
import { BiArrowBack } from "react-icons/bi";

const MyGroupList = () => {
  const db = getDatabase();
  const [mygrplist, setMygrplist] = useState([]);
  const [grpruqlist, setGrpreqlist] = useState([]);
  const [member, setMember] = useState([]);
  const [show, setShow] = useState(false);
  const [grpmember, setgrpMember] = useState(false);

  const user = useSelector((users) => users.login.loggedIn);

  useEffect(() => {
    const starCountRef = ref(db, "gruops");
    onValue(starCountRef, (snapshot) => {
      let grpArr = [];
      snapshot.forEach((item) => {
        if (user.uid == item.val().adminid) {
          grpArr.push({ ...item.val(), id: item.key });
        }
      });
      setMygrplist(grpArr);
    });
  }, []);

  const handleReqshow = (gitem) => {
    setShow(true);
    const starCountRef = ref(db, "joingruoprequest");
    onValue(starCountRef, (snapshot) => {
      let grpReqArr = [];
      snapshot.forEach((item) => {
        if (user.uid == item.val().adminid && item.val().groupid == gitem.id) {
          grpReqArr.push({ ...item.val(), id: item.key });
        }
        setGrpreqlist(grpReqArr);
      });
    });
  };

  const handleAcceptgrp = (item) => {
    set(push(ref(db, "gruopmembers")), {
      groupid: item.groupid,
      userid: item.userid,
      adminid: item.adminid,
      groupname: item.groupname,
      username: item.username,
      admin: item.adminname,
    }).then(() => {
      remove(ref(db, "joingruoprequest/" + item.id));
    });
  };

  const handleInfo = (gitem) => {
    setgrpMember(true);
    const starCountRef = ref(db, "gruopmembers");
    onValue(starCountRef, (snapshot) => {
      let grpmemberArr = [];
      snapshot.forEach((item) => {
        if (user.uid == gitem.adminid && gitem.id == item.val().groupid) {
          grpmemberArr.push({ ...item.val(), id: item.key });
        }
        setMember(grpmemberArr);
      });
    });
  };

  const handleRejectgrp = (gitem) => {
    remove(ref(db, "joingruoprequest/" + gitem.id));
  };
  console.log("ase");

  const handlegrpfnd = (item) => {
    remove(ref(db, "gruopmembers/" + item.id));
    console.log(item);
  };

  return (
    <>
      <div>
        <div className="mygrplist">
          <div className="mygrp-header">
            <h4>My Groups</h4>
          </div>
          {show && (
            <Button
              variant="contained"
              className="icongrp"
              onClick={() => setShow(false)}
            >
              <BiArrowBack />
            </Button>
          )}
          {grpmember && (
            <Button
              variant="contained"
              className="icongrp"
              onClick={() => setgrpMember(false)}
            >
              <BiArrowBack />
            </Button>
          )}
          {mygrplist.length == 0 ? (
            <Alert severity="info">No Gruope Created Yet!</Alert>
          ) : show ? (
            grpruqlist.length == 0 ? (
              <Alert severity="info">No Request Yet!</Alert>
            ) : (
              grpruqlist.map((item, i) => (
                <div className="mygrp-wrapper" key={i}>
                  <div className="mygrplist-image">
                    <picture>
                      <img src="./images/img1.jpg" alt="img1" />
                    </picture>
                  </div>
                  <div className="mygrplist-content">
                    <h4>{item.username}</h4>
                  </div>
                  <div className="mygrplist-btn">
                    <Button
                      variant="contained"
                      onClick={() => handleRejectgrp(item)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleAcceptgrp(item)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            )
          ) : grpmember ? (
            member.map((item, i) => (
              <div className="mygrp-wrapper" key={i}>
                <div className="mygrplist-image">
                  <picture>
                    <img src="./images/img1.jpg" alt="img1" />
                  </picture>
                </div>
                <div className="mygrplist-content">
                  <h4>{item.username}</h4>
                </div>
                <div className="mygrplist-btn2">
                  <Button
                    variant="contained"
                    onClick={() => handlegrpfnd(item)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            mygrplist.map((item, i) => (
              <div className="mygrp-wrapper" key={i}>
                <div className="mygrplist-image">
                  <picture>
                    <img src="./images/img1.jpg" alt="img1" />
                  </picture>
                </div>
                <div className="mygrplist-content">
                  <span>Admin : {item.admin}</span>
                  <h4>{item.groupname}</h4>
                  <span>{item.grouptag}</span>
                </div>
                <div className="mygrplist-btn">
                  <Button variant="contained" onClick={() => handleInfo(item)}>
                    Info
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleReqshow(item)}
                  >
                    Request
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyGroupList;
