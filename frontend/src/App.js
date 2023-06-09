// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotDetails from "./components/SpotDetails/spotDetails"
import Spots from "./components/HomePage/spots";
import CreateSpotForm from "./components/CreateSpots/index"; // Import the CreateSpotForm component
import ManageSpots from "./components/ManageSpots/index"; // Import the ManageSpots component
import UpdateSpotForm from "./components/UpdateSpotForm";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/spots/update/:id" component={UpdateSpotForm} />
          <Route path="/spots/:id"> 
            <SpotDetails />
          </Route>
          <Route path="/create-spot"> 
            <CreateSpotForm />
          </Route>
          <Route path="/manage-spots"> 
            <ManageSpots />
          </Route>
          <Route exact path="/"> 
            <Spots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
