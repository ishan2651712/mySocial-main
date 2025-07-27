import React, { useState, useRef } from "react";
import classes from "./UpdatePassword.module.css";
import Axios from "../../axios";

import { useHistory } from "react-router-dom";
import Spinner from "./../UI/Spinner/Spinner";
import { withCookies } from "react-cookie";

const UpdatePassword = ({ cookies, login, signup, errormsg }) => {
  const [status, setStatus] = useState(errormsg);
  const [updatePassword, setUpdatePassword] = useState(null);
  const [loading, setLoading] = useState(null);

  const currentPasswordRef = useRef(null);
  const updatedPasswordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const history = useHistory();

  const updatePasswordHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const currentPassword = currentPasswordRef.current.value;
    const updatedPassword = updatedPasswordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;

    Axios({
      method: "PATCH",
      url: `/social/users/updatePassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        currentPassword,
        updatedPassword,
        passwordConfirm,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data) {
          cookies.set("userLogin", res.data.data);
          setStatus("Password Updated Successfully");
          setUpdatePassword(true);
          setLoading(false);
          setTimeout(() => {
            history.push("/");
          }, 1000);
        } else {
          setStatus(errormsg);
          setUpdatePassword(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.error?.message ||
          "Network error. Please try again.";
        setStatus(msg);
        setUpdatePassword(false);
        setLoading(false);
      });
  };

  const attachedClasses = [updatePassword ? classes.Green : classes.Red];

  return (
    <div className={classes.loginpage}>
      <div className={classes.form}>
        {loading ? (
          <Spinner />
        ) : (
          <form className={classes.loginform}>
            <div>
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                ref={currentPasswordRef}
              />
              <input
                type="password"
                placeholder="New Password"
                name="updatedPassword"
                ref={updatedPasswordRef}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="passwordConfirm"
                ref={passwordConfirmRef}
              />
            </div>
            <button onClick={updatePasswordHandler}>update password</button>

            <span className={attachedClasses.join(" ")}>
              {updatePassword === null ? " " : status}
            </span>

            <p className={classes.message} onClick={login}>
              Log-in
            </p>
            <p className={classes.message} onClick={signup}>
              Not registered? Create an account
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default withCookies(UpdatePassword);
