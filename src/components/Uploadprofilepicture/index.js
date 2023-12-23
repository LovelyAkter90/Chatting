import React, { useRef } from "react";
import { useState } from "react";
import "./style.css";
import { BsImage } from "react-icons/bs";
import ImageCropper from "./ImageCropper";
import "cropperjs/dist/cropper.css";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { LoginUsers } from "../../features/Slice/LoginSlice";

const Uploadprofile = ({ setOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((users) => users.login.loggedIn);
  const auth = getAuth();
  const chooseFile = useRef(null);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const storage = getStorage();
  const storageRef = ref(storage, user.uid);

  const handleUploadProfile = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setOpen(false);
            dispatch(LoginUsers({ ...user, photoURL: downloadURL }));
            localStorage.setItem(
              "users",
              JSON.stringify({ ...user, photoURL: downloadURL })
            );
          });
        });
      });
    }
  };

  return (
    <>
      <div className="upload-box">
        <input
          type="file"
          hidden
          ref={chooseFile}
          onChange={handleUploadProfile}
        />
        <div className="upload-icon" onClick={() => chooseFile.current.click()}>
          <BsImage />
          <h4>Upload Image</h4>
          {image && (
            <ImageCropper
              image={image}
              setImage={setImage}
              setCropper={setCropper}
              cropData={cropData}
              getCropData={getCropData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Uploadprofile;
