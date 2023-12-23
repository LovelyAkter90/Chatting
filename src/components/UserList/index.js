import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getStorage, getDownloadURL, ref as Ref } from "firebase/storage";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import Alert from "@mui/material/Alert";

const Userlist = () => {
  const [userlists, setUserlists] = useState([]);
  const [frndreq, setFrndreq] = useState([]);
  const [frndlist, setFrendlist] = useState([]);
  const [filterusers, setFliterusers] = useState([]);
  const [cancle, setCancle] = useState([]);
  const [remove, setRemove] = useState(false);

  const user = useSelector((users) => users.login.loggedIn);
  const db = getDatabase();

  const storage = getStorage();

  // //browser e show korar jonno use korse useEffect
  // useEffect(() => {
  //   const starCountRef = ref(db, "users/");
  //   onValue(starCountRef, (snapshot) => {
  //     const usearr = [];
  //     snapshot.forEach((userlists) => {
  //       if (user.uid !== userlists.key) {
  //         getDownloadURL(Ref(storage, userlists.key)).then((url) => {
  //           usearr
  //             .push({
  //               ...userlists.val(),
  //               id: userlists.key,
  //               picture: url,
  //             })
  //             .catch((err) => {
  //               usearr.push({
  //                 ...userlists.val(),
  //                 id: userlists.key,
  //                 picture: null,
  //               });
  //             })
  //             .then(() => {
  //               setUserarrs([...usearr]);
  //             });
  //         });
  //       }
  //     });
  //     setUserlists(usearr);
  //   });
  // }, []);
  // console.log(userlists);

  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      const userarr = [];
      snapshot.forEach((userlists) => {
        if (user.uid != userlists.key) {
          getDownloadURL(Ref(storage, userlists.key))
            .then((downloadURL) => {
              userarr.push({
                ...userlists.val(),
                id: userlists.key,
                profilePicture: downloadURL,
              });
            })
            .catch(() => {
              userarr.push({
                ...userlists.val(),
                id: userlists.key,
                profilePicture: null,
              });
            })
            .then(() => {
              setUserlists([...userarr]);
            });
        }
      });
      setUserlists(userarr);
    });
  }, []);
  console.log(userlists);

  // useEffect(() => {
  //   const starCountRef = ref(db, "users/");
  //   onValue(starCountRef, (snapshot) => {
  //     const userarr = [];
  //     snapshot.forEach((userlists) => {
  //       if (user.uid != userlists.key) {
  //         getDownloadURL(Ref(storage, userlists.key))
  //           .then((url) => {
  //             userarr.push({
  //               ...userlists.val(),
  //               id: userlists.key,
  //               profilePicture: url,
  //             });
  //           })
  //           .then(() => {
  //             setUserlists([...userarr]);
  //           });
  //       }
  //     });
  //     setUserlists(userarr);
  //   });
  // }, []);
  //sent request
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

  const handleCancle = (data) => {
    cancle.map((item) => {
      if (data.id == item.reciverid) {
        remove(ref(db, "friendrequest/" + item.id));
      }
    });
    console.log(data);
  };

  //show friendlist

  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      const frndArr = [];
      snapshot.forEach((item) => {
        frndArr.push(item.val().recieverid + item.val().senderid);
      });
      setFrendlist(frndArr);
    });
  }, []);

  //show friendrequest
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let reqArr = [];
      let cancleArr = [];
      snapshot.forEach((item) => {
        reqArr.push(item.val().recieverid + item.val().senderid);
        cancleArr.push({ ...item.val(), id: item.key });
      });
      setCancle(cancleArr);
      setFrndreq(reqArr);
    });
  }, [db]);

  // for cancle request

  //for searching option

  const handleSerach = (e) => {
    let arr = [];

    // if (e.target.value.length === 0 ) {
    //     setFilteruser([]);
    // }

    userlists.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
        setFliterusers(arr);
      } else if (
        item.username.toLowerCase().includes(e.target.value.toLowerCase()) !==
        -1
      ) {
        setFliterusers(arr);
        setRemove(true);
      }
    });
  };

  return (
    <>
      <div>
        <div className="userlist">
          <div className="userlist-header">
            <h4>User List</h4>
          </div>
          <div className="search">
            <div className="search-icon">
              <BiSearch />
            </div>
            <div className="search-field">
              <input
                onChange={handleSerach}
                type="text"
                placeholder="Write Here..."
              />
            </div>
          </div>
          {filterusers.length > 0 ? (
            filterusers.map((item, i) => (
              <div key={i} className="userlist-wrapper">
                <div className="userlist-image">
                  <picture>
                    <img
                      src={item.profilePicture || "./images/avater.png"}
                      onError={(e) => {
                        e.target.src = "./images/avater.png";
                      }}
                      alt=""
                    />
                  </picture>
                </div>
                <div className="userlist-content">
                  <h4>{item.username}</h4>
                  <p>Today, 8:56pm</p>
                </div>
                <div className="userlist-btn">
                  {frndlist.includes(item.id + user.uid) ||
                  frndlist.includes(user.uid + item.id) ? (
                    <Button variant="contained">Friends</Button>
                  ) : frndreq.includes(item.id + user.uid) ||
                    frndreq.includes(user.uid + item.id) ? (
                    <Button variant="contained">Cancel Request</Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handlesentRequest(item)}
                    >
                      Sent Request
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : remove && filterusers.length == 0 ? (
            <Alert severity="info">This User is Not Exit!</Alert>
          ) : (
            userlists.map((item, i) => (
              <div key={i} className="userlist-wrapper">
                <div className="userlist-image">
                  <picture>
                    <img
                      src={item.profilePicture || "./images/avater.png"}
                      onError={(e) => {
                        e.target.src = "./images/avater.png";
                      }}
                      alt=""
                    />
                  </picture>
                </div>
                <div className="userlist-content">
                  <h4>{item.username}</h4>
                  <p>Today, 8:56pm</p>
                </div>
                <div className="userlist-btn">
                  {frndlist.includes(item.id + user.uid) ||
                  frndlist.includes(user.uid + item.id) ? (
                    <Button variant="contained">Friends</Button>
                  ) : frndreq.includes(item.id + user.uid) ? (
                    <Button
                      variant="contained"
                      onClick={(item) => {
                        handleCancle(item);
                      }}
                    >
                      Cancle Friends
                    </Button>
                  ) : frndreq.includes(user.uid + item.id) ? (
                    <Button variant="contained" size="small">
                      pending
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handlesentRequest(item)}
                    >
                      Sent Request
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Userlist;
