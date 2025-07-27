import React, { useState, useRef } from "react";
import classes from "./Signup.module.css";
import Axios from "../../axios";

import { useHistory } from "react-router-dom";
import Spinner from "../UI/Spinner/Spinner";
import { withCookies } from "react-cookie";

const Signup = ({ cookies, login }) => {
  const [signedUp, setSignedUp] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const history = useHistory();

  const signUp = (event) => {
    event.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = confirmPasswordRef.current.value;

    setLoading(true);

    Axios({
      method: "POST",
      url: `/social/users/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name,
        email,
        username,
        password,
        passwordConfirm,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data) {
          setSignedUp(true);
          setStatus("Account Created Successfully");
          setLoading(false);
          cookies.set("userLogin", res.data.data);

          setTimeout(() => {
            history.push("/");
          }, 1000);
        } else {
          setSignedUp(false);
          setStatus("Unexpected error. Please try again.");
          setLoading(false);
        }
      })
      .catch((err) => {
        setSignedUp(false);
        const msg =
          err.response?.data?.error?.message ||
          "Network Error, Please try again later";
        setStatus(msg);
        setLoading(false);
      });
  };

  const attachedClasses = [signedUp ? classes.Green : classes.Red];

  return (
    <div className={classes.loginpage}>
      <div className={classes.form}>
        {loading ? (
          <Spinner />
        ) : (
          <form className={classes.registerform}>
            <input type="text" placeholder="name" name="name" ref={nameRef} />
            <input
              type="text"
              placeholder="email address"
              name="email"
              ref={emailRef}
            />
            <input
              type="text"
              placeholder="username"
              name="username"
              ref={usernameRef}
            />
            <input
              type="password"
              placeholder="password"
              name="password"
              ref={passwordRef}
            />
            <input
              type="password"
              placeholder=" confirm password"
              name="confirmPassword"
              ref={confirmPasswordRef}
            />

            <button onClick={signUp}>create</button>
            <span className={attachedClasses.join(" ")}>{status}</span>
            <p className={classes.message} onClick={login}>
              Already registered? <span>Sign In</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default withCookies(Signup);
