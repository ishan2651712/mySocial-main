import React, { useState, useRef } from "react";
import classes from "./Signup.module.css";
import fetchAPI from "../../fetchAPI";

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

    fetchAPI(`/social/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      credentials: 'include', // Equivalent to `withCredentials: true` in Axios
      body: JSON.stringify({ // Stringify the data object
        name,
        email,
        username,
        password,
        passwordConfirm,
      }),
    })
      .then((res) => {
        if (res.data) { // Assuming res.data contains the response data
          setSignedUp(true);
          setStatus("Account Created Successfully");
          setLoading(false);
          cookies.set("userLogin", res.data.data); // Set user data in cookies

          setTimeout(() => {
            history.push("/"); // Redirect to home page after 1 second
          }, 1000);
        } else {
          setSignedUp(false);
          setStatus("Unexpected error. Please try again.");
          setLoading(false);
        }
      })
      .catch((err) => {
        // Handle error if the fetch request fails (network error or response issue)
        setSignedUp(false);
        const msg =
          err?.response?.data?.error?.message ||
          "Network Error, Please try again later"; // Default message in case of error
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
