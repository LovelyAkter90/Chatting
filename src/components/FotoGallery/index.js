import React, { useRef } from "react";
import "./style.css";
import { TfiGallery } from "react-icons/tfi";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, push, set, ref } from "firebase/database";
import { useSelector } from "react-redux";

const FotoGallery = () => {
  const db = getDatabase();
  const storage = getStorage();
  const user = useSelector((users) => users.login.loggedIn);
  const activeChatName = useSelector((active) => active.active.active);

  const chooseFile = useRef(null);

  const handleImageGal = (e) => {
    console.log(e.target.files[0]);
    const storageRef = sref(storage, uuidv4());

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
      }
    );
  };

  return (
    <div>
      <div className="fotogal">
        <div
          className="fotogal-icon"
          onClick={() => chooseFile.current.click()}
        >
          <input
            hidden
            type="file"
            onChange={handleImageGal}
            ref={chooseFile}
          />
          <TfiGallery />
        </div>
      </div>
    </div>
  );
};

export default FotoGallery;
