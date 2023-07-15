import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from "../componentImages/logo.png";
import audioFile from "../../music/DND.mp3";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleAudioControl = () => {
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li>
          <button className="createSpotButton">
            <NavLink to="/create-spot">Create a New Spot</NavLink>
          </button>
        </li>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <div className="NavBar">
      <li>
        <NavLink exact to="/">
          <img className="logo" src={logo} alt="Logo" />
        </NavLink>
      </li>
      <li>
        <button onClick={handleAudioControl} className="audio-control-button">
          {isAudioPlaying ? 'Pause' : 'Play'}
        </button>
      </li>
      {isLoaded && sessionLinks}
      <audio ref={audioRef} src={audioFile} loop />
    </div>
  );
}

export default Navigation;
