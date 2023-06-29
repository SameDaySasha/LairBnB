// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import { fetchSpots } from './store/spots'; 
import Navigation from "./components/Navigation";
import Spots from "./components/HomePage/spots";
import SpotDetails from "./components/SpotDetails/spotDetails"; // New import

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(fetchSpots()); 
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/spots/:id"> 
            <SpotDetails />
          </Route>
          <Route path="/"> 
            <Spots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
