import React, { useState } from "react";
import classes from "./CreatePost.module.css";
import Axios from "../../axios";
import { withRouter } from "react-router-dom";
import Spinner from "../UI/Spinner/Spinner";

const CreatePost = (props) => {
  const [status, setStatus] = useState(null);
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(null);

  const createPostHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const title = document.getElementsByName("title")[0].value;
    const content = document.getElementsByName("content")[0].value;

    Axios({
      method: "POST",
      url: `/social/posts`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { title, content },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        console.log(res.data.data);
        setStatus("Post created Successfully");
        setCreated(true);
        setLoading(false);
        setTimeout(() => {
          props.history.push("/");
        }, 1000);
      } else {
        console.log(props.errormsg);
        setStatus(props.errormsg);
        setCreated(false);
        setLoading(false);
      }
    });
  };

  const attachedClasses = [created ? classes.Green : classes.Red];

  return (
    <div className={classes.CreatePost}>
      {loading ? (
        <Spinner />
      ) : (
        <form className={classes.form}>
          <label>Create a Post</label>
          <hr />
          <input placeholder="Title" name="title" />
          <textarea
            placeholder="Your ideas and thoughts go here"
            name="content"
          ></textarea>
          <p className={attachedClasses.join(" ")}>{status}</p>
          <button onClick={createPostHandler}>Post</button>
        </form>
      )}
    </div>
  );
};

export default withRouter(CreatePost);
