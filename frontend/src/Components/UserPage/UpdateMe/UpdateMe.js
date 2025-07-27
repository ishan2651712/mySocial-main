import React, { useState, useRef, useEffect } from "react";
import classes from "./UpdateMe.module.css";
import { Link, useHistory } from "react-router-dom";
import { withCookies } from "react-cookie";
import Spinner from "../../UI/Spinner/Spinner";
import Axios from "../../../axios";

const UpdateMe = (props) => {
  const { cookies, errormsg } = props;
  const [updatedInfo, setUpdatedInfo] = useState(true);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);

  const history = useHistory();

  const defaultdata = cookies.get("userLogin");

  const updateInfo = (event) => {
    event.preventDefault();
    setLoading(true);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const username = usernameRef.current.value;

    fetchAPI(`/social/users/updateMe`, {
      method: "PATCH", // Set HTTP method to PATCH
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      credentials: 'include', // Equivalent to `withCredentials: true` in Axios
      body: JSON.stringify({ // Stringify the data object
        name,
        email,
        username,
      }),
    })
      .then((res) => {
        if (res.data) {
          cookies.set("userLogin", res.data.data);
          setUpdatedInfo(true);
          setStatus("Details Updated");
          setLoading(false);
          setTimeout(() => {
            history.push("/");
          }, 1000);
        } else {
          setUpdatedInfo(false);
          setStatus(errormsg);
          setLoading(false);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.error?.message ||
          "Network error. Please try again.";
        setUpdatedInfo(false);
        setStatus(msg);
        setLoading(false);
      });
  };

  const attachedClasses = [
    updatedInfo ? classes.Green : classes.Red,
  ];

  return (
    <div className={classes.loginpage}>
      <div className={classes.form}>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <p className={classes.Title}>Update Info</p>
            <form className={classes.loginform} id="loginForm">
              <input
                type="text"
                placeholder="name"
                name="name"
                defaultValue={defaultdata?.name}
                ref={nameRef}
              />
              <input
                type="email"
                placeholder="email"
                name="email"
                defaultValue={defaultdata?.email}
                ref={emailRef}
              />
              <input
                type="username"
                placeholder="username"
                name="username"
                defaultValue={defaultdata?.username}
                ref={usernameRef}
              />

              <button onClick={updateInfo}>update info</button>
              <p className={attachedClasses.join(" ")}>{status}</p>
              <span className={classes.message}>
                <Link
                  to="/updatePassword"
                  style={{ textDecoration: "inherit", color: "inherit" }}
                >
                  Want to update Password? Click here
                </Link>
              </span>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default withCookies(UpdateMe);
