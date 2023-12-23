import React, { useState } from "react";
import "./style.css";
import { AiOutlineCamera } from "react-icons/ai";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import {
  getDownloadURL,
  getStorage,
  ref as sref,
  uploadString,
} from "firebase/storage";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const FotoCamera = () => {
  const db = getDatabase();
  const storage = getStorage();
  const user = useSelector((users) => users.login.loggedIn);
  const activeChatName = useSelector((active) => active.active.active);

  const [open, setOpen] = useState(false);
  const [captureImge, setCaptureImage] = useState("");
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    setCaptureImage(dataUri);
    const storageRef = sref(storage, uuidv4());
    uploadString(storageRef, dataUri, "data_url")
      .then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db, "singelMessage")), {
            whoSendId: user.uid,
            whoSendName: user.displayName,
            whoReciveId: activeChatName?.id,
            whoReciveName: activeChatName?.name,
            image: downloadURL,
            Date: `${new Date()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
          });
          console.log("File available at", downloadURL);
        });
      })
      .then(() => {
        setOpen(false);
      });
  }
  console.log(captureImge);
  return (
    <div>
      <div className="foto">
        <div onClick={() => setOpen(true)}>
          <AiOutlineCamera />
        </div>
      </div>
      {open && (
        <div className="capture-image">
          <Camera
            imageCompression={1}
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FotoCamera;
