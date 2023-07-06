// Import the necessary modules from the libraries
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';  // Importing the shared CSS file
import logo from '../componentImages/logo.png';  // Import your logo

// Define the Navigation component
function Navigation({ isLoaded }){
  // Hook that allows you to extract data from the Redux store state
  const sessionUser = useSelector(state => state.session.user);

  // Variable to store JSX for the links to be displayed based on whether a user is logged in
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <ProfileButton user={sessionUser} />  {/* Display the ProfileButton if a user is logged in */}
      </div>
    );
  } else {
    sessionLinks = (
      <div>
          <NavLink to="/login" className="nav-link">Log In</NavLink>  {/* Link to the login page */}
          <NavLink to="/signup" className="nav-link">Sign Up</NavLink>  {/* Link to the signup page */}
      </div>
    );
  }

  // The JSX returned by the Navigation component
  return (
    <div className="nav-container">
      
      <NavLink exact to="/" className="nav-link home-link">
    <img src={logo} alt="Home" className="logo" />
</NavLink>
      {isLoaded && sessionLinks}  {/* If the page is loaded, display the session links */}
    </div>
  );
}

export default Navigation;
