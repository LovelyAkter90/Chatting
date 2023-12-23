import React, { useEffect, useState } from "react";
import "./style.css";
import { Button } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import { useDispatch } from "react-redux";
import { Activesingel } from "../../features/Slice/ActiveSingelSlice";
const Messaggruope = () => {
  const db = getDatabase();
  const dispatch = useDispatch();

  const [messgrpe, setMessgrpe] = useState([]);

  //for active group list checking
  const handleActiveGroup = (item) => {
    dispatch(
      Activesingel({
        status: " groupe",
        id: item.id,
        name: item.groupname,
        adminid: item.adminid,
      })
    );
  };

  useEffect(() => {
    const starCountRef = ref(db, "gruops");
    onValue(starCountRef, (snapshot) => {
      let mesggrpArr = [];
      snapshot.forEach((item) => {
        mesggrpArr.push({ ...item.val(), id: item.key });
      });
      setMessgrpe(mesggrpArr);
    });
  }, []);
  console.log(messgrpe);
  return (
    <div>
      <div className="mesgrp">
        <div className="mesgrp-header">
          <h4>All Groups Name Here</h4>
        </div>

        {messgrpe.map((item, i) => (
          <div
            className="mesg-part-wrapper"
            key={i}
            onClick={() => handleActiveGroup(item)}
          >
            <div className="mesg-part-image">
              <picture>
                <img src="./images/g4.jpg" alt="" />
              </picture>
            </div>
            <div className="mesg-part-content">
              <h5>{item.admin}</h5>
              <h4>{item.groupname}</h4>
              <p>{item.grouptag}</p>
            </div>
            <div className="msg-btn">
              <Button variant="contained">Message</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messaggruope;
