import React from "react";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import Posts from "./Containers/Posts/Posts";
import { Route } from "react-router-dom";
import Authenticate from "./Containers/Authentication/Authenticate";
import { withCookies } from "react-cookie";
import CreatePost from "./Components/CreatePost/CreatePost";
import errorHandler from "./hoc/ErrorHandler/ErrorHandler";
import EditPost from "./Components/EditPost/EditPost";
import UserPage from "./Components/UserPage/UserPage";
import UpdateMe from "./Components/UserPage/UpdateMe/UpdateMe";
import UpdatePassword from "./Components/UpdatePassword/UpdatePassword";
import "bootstrap/dist/css/bootstrap.min.css";

const App = (props) => {
  const { cookies, errormsg } = props;

  return (
    <Layout cookies={cookies}>
      <Route
        path="/home"
        exact
        render={() => <Posts cookies={cookies} />}
      />

      <Route
        path="/authenticate"
        render={() => (
          <Authenticate cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route
        path="/createPost"
        render={() => (
          <CreatePost cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route
        path="/:id/edit"
        render={() => (
          <EditPost cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route
        path="/user/:userId"
        render={() => (
          <UserPage cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route
        path="/me"
        render={() => (
          <UserPage cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route path="/" exact render={() => <Posts />} />

      <Route
        path="/updateMe"
        render={() => (
          <UpdateMe cookies={cookies} errormsg={errormsg} />
        )}
      />

      <Route
        path="/updatePassword"
        render={() => (
          <UpdatePassword cookies={cookies} errormsg={errormsg} />
        )}
      />
    </Layout>
  );
};

export default withCookies(errorHandler(App));
