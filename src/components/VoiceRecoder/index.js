import React, { useState } from "react";
import "./style.css";
import { MdSettingsVoice } from "react-icons/md";
import { BsTelegram } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { AudioRecorder } from "react-audio-voice-recorder";

const VoiceRecoder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [blob, setBlob] = useState("");
  const [showaudio, setShowAudio] = useState(false);

  return <div></div>;
};

export default VoiceRecoder;
