import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";

const Gruoplist = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [grpname, setGrpName] = useState("");
  const [grptag, setGrpTag] = useState("");
  const user = useSelector((users) => users.login.loggedIn);

  const db = getDatabase();
  const [randomgrp, setRandomgrp] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "gruops");
    onValue(starCountRef, (snapshot) => {
      let grpArr = [];
      snapshot.forEach((item) => {
        if (user.uid !== item.val().adminid) {
          grpArr.push({ ...item.val(), id: item.key });
        }
      });
      setRandomgrp(grpArr);
    });
  }, []);

  const handleCreateGrp = (e) => {
    set(push(ref(db, "gruops")), {
      groupname: grpname,
      grouptag: grptag,
      admin: user.displayName,
      adminid: user.uid,
    }).then(() => {
      setOpen(false);
    });
  };

  //  making join list

  const handleJoingrp = (item) => {
    set(push(ref(db, "joingruoprequest")), {
      groupid: item.id,
      groupname: item.groupname,
      grouptag: item.grouptag,
      adminid: item.adminid,
      adminname: item.admin,
      userid: user.uid,
      username: user.displayName,
    });
  };

  return (
    <div className="grplist">
      <div className="grp-header">
        <div className="grp-header2">
          <h4>Group Lists</h4>
        </div>
        <div className="grp-creation">
          <Button variant="contained" onClick={handleOpen}>
            Create Group
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create New Group
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <TextField
                  id="filled-basic"
                  label="Group Name"
                  variant="filled"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setGrpName(e.target.value)}
                />
                <TextField
                  id="filled-basic"
                  label="Group Tagline"
                  variant="filled"
                  margin="normal"
                  fullWidth
                  onChange={(e) => setGrpTag(e.target.value)}
                />
                <Button
                  className="Creat-grp-btn"
                  variant="contained"
                  onClick={handleCreateGrp}
                >
                  Create New Group
                </Button>
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
      {randomgrp.length == 0 ? (
        <Alert severity="info">No Gruope Created Yet!</Alert>
      ) : (
        randomgrp.map((item, i) => (
          <div className="grp-item-wrapper" key={i}>
            <div className="grp-image">
              <picture>
                <img src="/images/g1.jpg" alt="g1" />
              </picture>
            </div>
            <div className="grp-content">
              <span>Admin : {item.admin}</span>
              <h5>{item.groupname}</h5>
              <span>{item.grouptag}</span>
            </div>
            <div className="grp-btn">
              <Button variant="contained" onClick={() => handleJoingrp(item)}>
                Join
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Gruoplist;
