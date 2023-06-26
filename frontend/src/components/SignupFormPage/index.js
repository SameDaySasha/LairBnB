import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupForm.css"

function SignupFormPage() {
  // Initializing Redux hooks
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  // Initializing state variables using React hooks
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // If the user is already logged in, redirect to the home page
  if (sessionUser) return <Redirect to="/" />;

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Checking if the password matches the confirm password
    if (password === confirmPassword) {
      setErrors({}); // Clearing any previous errors
      // Dispatching the signup action with user data
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors); // Setting errors received from the server
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    }); // Setting an error for unmatched passwords
  };

  // Rendering the signup form
  return (
    <div className="signup-page">
      <div className="signup-form-background" >
        <h1 className="form-title">Sign Up</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>} {/* Displaying email error, if any */}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>} {/* Displaying username error, if any */}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>} {/* Displaying first name error, if any */}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>} {/* Displaying last name error, if any */}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>} {/* Displaying password error, if any */}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>} {/* Displaying confirm password error, if any */}
          <button type="submit">Sign Up</button> {/* Submit button */}
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
