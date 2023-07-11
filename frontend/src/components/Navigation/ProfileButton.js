// Import the necessary modules from the libraries
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'; // <-- import useHistory
import * as sessionActions from '../../store/session';
import './Navigation.css';  // Importing the shared CSS file

// Define the ProfileButton component
function ProfileButton({ user }) {
  // Hook that allows you to dispatch actions to your Redux store
  const dispatch = useDispatch();
  
  // Add useHistory hook here
  const history = useHistory();

  // State variable for managing visibility of the dropdown menu, default is false (not visible)
  const [showMenu, setShowMenu] = useState(false);

  // Ref to the dropdown menu, used to detect clicks outside of it
  const ulRef = useRef();

  // Function to toggle the visibility of the dropdown menu
  const toggleMenu = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
  };

  // Effect that adds an event listener for clicks outside the dropdown menu when it's open
  useEffect(() => {
    if (!showMenu) return;

    // Function that closes the dropdown menu when a click is detected outside of it
    const closeMenuOutsideClick = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener('click', closeMenuOutsideClick);

    // Clean up function that removes the event listener when the component unmounts
    return () => document.removeEventListener("click", closeMenuOutsideClick);
  }, [showMenu]);  // Dependency array, effect will re-run if showMenu changes

  // Function to log out the user
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/'); // <-- redirect the user to home page
  };

  // Function to navigate to manage spots page
  const manageSpots = (e) => {
    e.preventDefault();
    history.push('/manage-spots'); // <-- redirect the user to manage spots page
  };

  // String for the dropdown menu's class name, depends on whether the menu is shown or not
  // Add 'visible' class when showMenu is true to display the dropdown
  const ulClassName = "profile-dropdown" + (showMenu ? " visible" : "");

  // The JSX returned by the ProfileButton component
  return (
    <>
      <button onClick={toggleMenu} className="profile-button">
        <i className="fas fa-user-circle" />  {/* Font Awesome user circle icon */}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>  {/* Display a greeting with the user's first name */}
        <li>{user.username}</li>  {/* Display the user's username */}
        <li>{user.firstName} {user.lastName}</li>  {/* Display the user's full name */}
        <li>{user.email}</li>  {/* Display the user's email */}
        <li>
          <button onClick={manageSpots}>Manage Spots</button>  {/* Button to navigate to manage spots page */}
        </li>
        <li>
          <button onClick={logout}>Log Out</button>  {/* Button to log out the user */}
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
