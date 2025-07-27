import React, { useState } from "react";
import classes from "./Login.module.css";
import fetchAPI from "../../fetchAPI";
import { withRouter } from "react-router-dom";

const Login = (props) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [status, setStatus] = useState(
    props.errormsg ? "Please Log in to access this feature" : null
  );
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  const login = (event) => {
    event.preventDefault();

    const password = document.getElementsByName("password")[0].value;
    const userInfo = { email: null, username: null };
    userInfo[props.loginType] = document.getElementsByName(props.loginType)[0].value;

    fetchAPI(`/social/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Send JSON data
      },
      credentials: 'include', // Equivalent to `withCredentials: true` in Axios
      body: JSON.stringify({
        email: userInfo.email,
        username: userInfo.username,
        password: password,
      }), // Stringify the data object
    })
      .then((res) => {
        if (res.data) { // Check if the response contains data
          setLoggedIn(true);
          setUsername(res.data.data.username);
          setUserId(res.data.data.id);
          setStatus("Log in successful");
          props.cookies.set("userLogin", res.data.data); // Store login data in cookies

          // Redirect after a short delay
          setTimeout(() => {
            props.history.push("/"); // Navigate to the home page
          }, 1000);
        } else {
          setLoggedIn(false);
          setStatus(props.errormsg); // Show error message if no data is returned
        }
      })
      .catch((err) => {
        // Handle errors (network or response parsing issues)
        console.error("Error:", err);
        setLoggedIn(false);
        setStatus("An error occurred. Please try again.");
      });
  };

  const attachedClasses = [loggedIn ? classes.Green : classes.Red];

  return (
    <div className={classes.loginpage}>
      <div className={classes.form}>
        <form className={classes.loginform} id="loginForm">
          <input
            type="text"
            placeholder={props.loginType}
            name={props.loginType}
          />
          <input type="password" placeholder="password" name="password" />
          <button onClick={login}>login</button>
          <span className={attachedClasses.join(" ")}>
            {loggedIn === null ? " " : status}
          </span>
          <p className={classes.message} onClick={props.loginEmail}>
            Log-in with {props.loginType === "email" ? "username" : "email"}
          </p>
          <p className={classes.message} onClick={props.forgotPassword}>
            forgot Password?
          </p>
          <p className={classes.message} onClick={props.signup}>
            Not registered? Create an account
          </p>
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
