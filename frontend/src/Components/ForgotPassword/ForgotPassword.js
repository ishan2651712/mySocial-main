import React, { useState } from "react";
import classes from "./ForgotPassword.module.css";
import fetchAPI from "../../fetchAPI";

import { withRouter } from "react-router-dom";
import Spinner from "./../UI/Spinner/Spinner";
import { withCookies } from "react-cookie";

const ForgotPassword = (props) => {
  const [status, setStatus] = useState(props.errormsg);
  const [forgotPassword, setForgotPassword] = useState(null);
  const [resetPassword, setResetPassword] = useState(null);
  const [loading, setLoading] = useState(null);

  const resetPasswordHandler = (event) => {
    event.preventDefault();

    const password = document.getElementsByName("password")[0].value;
    const passwordConfirm =
      document.getElementsByName("passwordConfirm")[0].value;
    const token = document.getElementsByName("token")[0].value;

    fetchAPI(`/social/users/resetPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Sending JSON data
      },
      credentials: 'include',
      body: JSON.stringify({
        password,
        passwordConfirm,
        token,
      }), // Stringify the request body
    })
      .then((res) => {
        if (res.data) { // Assuming res.data contains the response
          // Assuming the response includes a 'data' object containing the user's information
          props.cookies.set("userLogin", res.data.data);

          setStatus("Password Updated Successfully");
          setResetPassword(true);

          setTimeout(() => {
            props.history.push("/"); // Redirect after 1 second
          }, 1000);
        } else {
          setStatus(props.errormsg); // Handle the error message
          setResetPassword(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        // Handle errors in network or JSON parsing
        console.error("Error:", err);
        setStatus("Something went wrong!");
        setResetPassword(false);
        setLoading(false);
      });

  };

  const forgotPasswordHandler = (event) => {
    setLoading(true);
    event.preventDefault();

    const email = document.getElementsByName("email")[0].value;

    fetchAPI({
      method: "POST",
      url: `/social/users/forgotPassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        setStatus(res.data.message);
        setForgotPassword(true);
        setLoading(false);
      } else {
        setStatus(props.errormsg);
        setForgotPassword(false);
        setLoading(false);
      }
    });
  };

  const attachedClasses = [];

  if (forgotPassword) {
    attachedClasses.push(classes.Green);
  } else {
    attachedClasses.push(classes.Red);
  }

  if (resetPassword === false) {
    const index = attachedClasses.indexOf(classes.Green);
    if (index !== -1) attachedClasses.splice(index, 1);
    attachedClasses.push(classes.Red);
  }

  const content = loading ? (
    <Spinner />
  ) : (
    <form className={classes.loginform}>
      {!forgotPassword && (
        <input type="text" placeholder="email" name="email" />
      )}
      {forgotPassword && (
        <div>
          <input type="text" placeholder="token" name="token" />
          <input type="password" placeholder="New Password" name="password" />
          <input
            type="password"
            placeholder="Confirm New Password"
            name="passwordConfirm"
          />
        </div>
      )}
      {forgotPassword ? (
        <button onClick={resetPasswordHandler}>reset password</button>
      ) : (
        <button onClick={forgotPasswordHandler}>forgot password</button>
      )}
      <span className={attachedClasses.join(" ")}>
        {forgotPassword === null ? " " : status}
      </span>
      <p className={classes.message} onClick={props.login}>
        Log-in
      </p>

      <p className={classes.message} onClick={props.signup}>
        Not registered? Create an account
      </p>
    </form>
  );

  return (
    <div className={classes.loginpage}>
      <div className={classes.form}>{content}</div>
    </div>
  );
};

export default withCookies(withRouter(ForgotPassword));
