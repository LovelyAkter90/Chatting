import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ModalImage from "react-modal-image";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { FaTelegramPlane } from "react-icons/fa";
import FotoCamera from "../../components/FotoCamera";
import FotoGallery from "../FotoGallery";
import VoiceRecoder from "../VoiceRecoder";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BsTelegram } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { AudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { getDownloadURL } from "firebase/storage";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import moment from "moment/moment";
import Lottie from "lottie-react";
import empty from "../../svg/empty";
const actions = [
  { icon: <VoiceRecoder />, name: "Recoder" },
  { icon: <FotoCamera />, name: "Camrea" },
  { icon: <FotoGallery />, name: "Gallery" },
];

const Talking = () => {
  const db = getDatabase();
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [grpmessageList, setGrpmessageList] = useState([]);
  const [grpmemeberList, setGrpmemeberList] = useState([]);
  const [showAudio, setShowAudio] = useState(false);
  const [showEmoji, setshowEmoji] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [blob, setBlob] = useState("");
  const scorllMessage = useRef(null);

  const user = useSelector((users) => users.login.loggedIn);
  const activeChatName = useSelector((active) => active.active.active);

  ///for audio elements

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    setBlob(blob);
  };

  //for sending message
  const handleSendMsg = (e) => {
    if (activeChatName?.status == "singel") {
      set(push(ref(db, "singelMessage")), {
        whoSendId: user.uid,
        whoSendName: user.displayName,
        whoReciveId: activeChatName?.id,
        whoReciveName: activeChatName?.name,
        Showmessage: message,
        Date: `${new Date()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(() => {
        setMessage("");
      });
    } else {
      set(push(ref(db, "groupeMessage")), {
        whoSendId: user.uid,
        whoSendName: user.displayName,
        whoReciveId: activeChatName?.id,
        whoReciveName: activeChatName?.name,
        adminid: activeChatName?.adminid,
        Showmessage: message,
        Date: `${new Date()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(() => {
        setMessage("");
      });
      console.log("for grup message");
    }
  };

  //askii key

  const handleEnterPress = (e) => {
    if (e.key == "Enter") {
      if (activeChatName?.status == "singel") {
        set(push(ref(db, "singelMessage")), {
          whoSendId: user.uid,
          whoSendName: user.displayName,
          whoReciveId: activeChatName?.id,
          whoReciveName: activeChatName?.name,
          Showmessage: message,
          Date: `${new Date()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
        });
      }
    }
  };

  ///get singel message
  useEffect(() => {
    onValue(ref(db, "singelMessage"), (snapshot) => {
      let singeleMsgArr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId == user.uid &&
            item.val().whoReciveId == activeChatName?.id) ||
          (item.val().whoReciveId == user.uid &&
            item.val().whoSendId == activeChatName?.id)
        ) {
          singeleMsgArr.push(item.val());
        }
        setMessageList(singeleMsgArr);
      });
    });
  }, [activeChatName?.id]);
  console.log(messageList);

  // get groupemessage
  useEffect(() => {
    onValue(ref(db, "groupeMessage"), (snapshot) => {
      let groupeMsgArr = [];
      snapshot.forEach((item) => {
        {
          groupeMsgArr.push(item.val());
        }
        setGrpmessageList(groupeMsgArr);
      });
    });
  }, [activeChatName?.id]);
  console.log(grpmessageList);

  //for members id read
  useEffect(() => {
    onValue(ref(db, "gruopmembers"), (snapshot) => {
      let groupememberMsgArr = [];
      snapshot.forEach((item) => {
        groupememberMsgArr.push(item.val().groupid + item.val().userid);
      });
      setGrpmemeberList(groupememberMsgArr);
    });
  }, []);

  //reset form

  //emoji select function here
  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.emoji);
  };

  //for scrollmeassgeing

  useEffect(() => {
    scorllMessage?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {
    scorllMessage?.current?.scrollIntoView({ behavior: "smooth" });
  }, [grpmessageList]);
  return (
    <div>
      <div className="talking">
        <div className="active-users">
          <div className="active-user-img">
            <div className="active-image">
              <picture>
                <img src="./images/f1.jpg" alt="f1" />
              </picture>
            </div>
            <div className="active-info">
              <h4>{activeChatName?.name}</h4>
              <p>Online</p>
            </div>
            <div className="info-bar">
              <BiDotsVerticalRounded />
            </div>
          </div>
        </div>

        <div className="chatting">
          {activeChatName?.status == "singel" ? (
            messageList.map((item, i) => (
              <div ref={scorllMessage}>
                {item.whoSendId == user.uid ? (
                  item.Showmessage ? (
                    <>
                      <div className="right-chatting" key={i}>
                        <div className="right-text">
                          <p>{item.Showmessage}</p>
                          <span>{item.Date}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="right-img">
                      <ModalImage small={item.image} large={item.image} />
                      <span>{item.Date}</span>
                    </div>
                  )
                ) : item.Showmessage ? (
                  <>
                    <div className="left-chatting" key={i}>
                      <div className="left-text">
                        <p>{item.Showmessage}</p>
                        <span>{item.Date}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="left-img">
                    <ModalImage small={item.image} large={item.image} />
                    <span>{item.Date}</span>
                  </div>
                )}
              </div>
            ))
          ) : user?.uid == activeChatName?.adminid ||
            grpmemeberList.includes(activeChatName?.id + user.uid) ? (
            grpmessageList.map((item, i) => (
              <div ref={scorllMessage}>
                {item.whoSendId == user.uid
                  ? item.whoReciveId == activeChatName?.id && (
                      <div className="right-chatting" key={i}>
                        <div className="right-text">
                          <p>{item.Showmessage}</p>
                          <span>{item.Date}</span>
                        </div>
                      </div>
                    )
                  : item.whoReciveId == activeChatName?.id && (
                      <div className="left-chatting" key={i}>
                        <div className="left-text">
                          <p>{item.Showmessage}</p>
                          <span>{item.Date}</span>
                        </div>
                      </div>
                    )}
              </div>
            ))
          ) : (
            <div className="lottie-main">
              <div className="lottie">
                <Lottie animationData={empty} loop={true} />
              </div>
            </div>
          )}
          {/* <div className="right-chatting">
            <div className="right-text">
              <p>Hello... !</p>
              <span>Today, 2:12pm</span>
            </div>
            <div className="right-text">
              <p>I am good and hoew about you?</p>
              <span>Today, 2:12pm</span>
            </div>
          </div> */}
          {/* <div className="left-chatting">
            <div className="left-img">
              <ModalImage
                small={"./images/demo.jpg"}
                medium={"./images/demo.jpg"}
              />
            </div>
            <div className="left-text2">
              <span>Today, 3:20pm</span>
            </div>
            <div className="left-audio">
              <audio controls></audio>
            </div>
          </div> */}
          {/* <div className="right-chatting">
            <div className="right-text">
              <p>I am doing well. Can we meet up tomorrow?</p>
              <span>Today, 3:50pm</span>
            </div>
            <div className="right-audio">
              <audio controls></audio>
            </div>
          </div> */}
        </div>
        {activeChatName.status == "singel" ? (
          <div className="message-input">
            <div className="text-input-field">
              {
                <div className="emoji" onClick={() => setshowEmoji(!showEmoji)}>
                  <HiOutlineEmojiHappy />
                  {showEmoji && (
                    <div className="emoji-picker">
                      <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </div>
                  )}
                </div>
              }
              <div className="input-level">
                <input
                  type="text"
                  value={message}
                  onKeyUp={handleEnterPress}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="messg-input-icon">
                <Box
                  sx={{
                    height: 20,
                    transform: "translateZ(0px)",
                    flexGrow: 1,
                    className: "speddial",
                  }}
                >
                  <SpeedDial
                    className="speeddial"
                    ariaLabel="SpeedDial basic example"
                    sx={{
                      position: "absolute",
                      bottom: -15,
                      right: 0,
                    }}
                    icon={<SpeedDialIcon />}
                  >
                    {actions.map((action) => (
                      <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                      />
                    ))}
                  </SpeedDial>
                </Box>
              </div>
            </div>
            {
              <div className="voice-record">
                <div className="audio">
                  <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                  />
                </div>
              </div>
            }
            {!audioURL && (
              <div className="audio-controls-1">
                <div class="voice-controls">
                  <audio controls src={audioURL}></audio>
                  <div className="voice-btn">
                    <div className="send-audio">
                      <button type="submit">
                        <BsTelegram />
                      </button>
                    </div>
                    <div className="delet-audio">
                      <button
                        type="button"
                        onClick={() => setAudioURL(!showAudio)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!showAudio && (
              <div className="send-btn" onClick={handleSendMsg}>
                <button type="button">
                  <FaTelegramPlane />
                </button>
              </div>
            )}
          </div>
        ) : user?.uid == activeChatName?.adminid ||
          grpmemeberList.includes(activeChatName?.id + user.uid) ? (
          <div className="message-input">
            <div className="text-input-field">
              {
                <div className="emoji" onClick={() => setshowEmoji(!showEmoji)}>
                  <HiOutlineEmojiHappy />
                  {showEmoji && (
                    <div className="emoji-picker">
                      <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </div>
                  )}
                </div>
              }
              <div className="input-level">
                <input
                  type="text"
                  value={message}
                  onKeyUp={handleEnterPress}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="messg-input-icon">
                <Box
                  sx={{
                    height: 20,
                    transform: "translateZ(0px)",
                    flexGrow: 1,
                    className: "speddial",
                  }}
                >
                  <SpeedDial
                    className="speeddial"
                    ariaLabel="SpeedDial basic example"
                    sx={{
                      position: "absolute",
                      bottom: -15,
                      right: 0,
                    }}
                    icon={<SpeedDialIcon />}
                  >
                    {actions.map((action) => (
                      <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                      />
                    ))}
                  </SpeedDial>
                </Box>
              </div>
            </div>
            {
              <div className="voice-record">
                <div className="audio">
                  <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                  />
                </div>
              </div>
            }
            {!audioURL && (
              <div className="audio-controls-1">
                <div class="voice-controls">
                  <audio controls src={audioURL}></audio>
                  <div className="voice-btn">
                    <div className="send-audio">
                      <button type="submit">
                        <BsTelegram />
                      </button>
                    </div>
                    <div className="delet-audio">
                      <button
                        type="button"
                        onClick={() => setAudioURL(!showAudio)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!showAudio && (
              <div className="send-btn" onClick={handleSendMsg}>
                <button type="button">
                  <FaTelegramPlane />
                </button>
              </div>
            )}
          </div>
        ) : (
          "nai"
        )}
      </div>
    </div>
  );
};

export default Talking;
