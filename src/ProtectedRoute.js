import React from "react";
import { Redirect, Route } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";

export const ProtectedRoute = ({ ...props }) => {
  let isLoggedIn = false;
  const userProfile = reactLocalStorage.getObject("userProfile");
  if (_.isEmpty(userProfile) === false && _.has(userProfile, "uniqueId")) {
    isLoggedIn = true;
  }

  if (isLoggedIn) {
    return <Route {...props} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }
};
