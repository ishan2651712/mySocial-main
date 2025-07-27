import React, { useState, useEffect } from "react";
import classes from "./EditPost.module.css";
import Axios from "../../axios";
import { withRouter } from "react-router-dom";
import Spinner from "../UI/Spinner/Spinner";

const EditPost = (props) => {
  const { match, history, errormsg } = props;
  const { id } = match.params;

  const [status, setStatus] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    console.log(id);
    Axios({
      method: "GET",
      url: `/social/posts/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data.data);
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const updatePostHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const updatedTitle = document.getElementsByName("title")[0].value;
    const updatedContent = document.getElementsByName("content")[0].value;

    Axios({
      method: "PATCH",
      url: `/social/posts/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        console.log(res.data.data);
        setStatus("Post updated Successfully");
        setUpdated(true);
        setLoading(false);
        setTitle(updatedTitle);
        setContent(updatedContent);
        setTimeout(() => {
          history.push("/");
        }, 1000);
      } else {
        setStatus(errormsg);
        setUpdated(false);
        setLoading(false);
      }
    });
  };

  const attachedClasses = [updated ? classes.Green : classes.Red];

  return (
    <div className={classes.CreatePost}>
      {loading ? (
        <Spinner />
      ) : (
        <form className={classes.form}>
          <label>Edit Post</label>
          <hr />
          <input name="title" defaultValue={title} />
          <textarea name="content" defaultValue={content}></textarea>
          <p className={attachedClasses.join(" ")}>{status}</p>
          <button onClick={updatePostHandler}>Edit</button>
        </form>
      )}
    </div>
  );
};

export default withRouter(EditPost);
