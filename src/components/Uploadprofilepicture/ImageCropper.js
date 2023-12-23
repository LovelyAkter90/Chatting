import React from "react";
import Cropper from "react-cropper";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Button from "@mui/material/Button";

const ImageCropper = ({
  image,
  setImage,
  setCropper,
  cropData,
  getCropData,
}) => {
  return (
    <div className="crop-box">
      <div className="crop-main">
        <div className="crop-header">
          <h4>Upload Profile Image</h4>
        </div>
        <div className="close-icon">
          <AiOutlineCloseCircle onClick={() => setImage()} />
        </div>
      </div>
      <div className="image-preview">
        <div className="img-preview" />
      </div>
      <Cropper
        className="image-crop"
        zoomTo={0.5}
        initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        guides={true}
      />
      <div className="upload-btn">
        <Button variant="contained" onClick={getCropData}>
          Upload Now
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
