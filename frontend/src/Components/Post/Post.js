import React, { useState } from "react";
import classes from "./Post.module.css";
import Votes from "./Votes/Votes";
import Aux from "../../hoc/Auxilliary/Auxilliary";
import ToggleFullPost from "./ToggleFullPost/ToggleFullPost";
import Axios from "../../axios";
import { Link, withRouter } from "react-router-dom";
import DropDown from "../DropDown/DropDown";

const Post = (props) => {
  const [upvotes, setUpvotes] = useState(props.upvoteCount);
  const [downvotes, setDownvotes] = useState(props.downvoteCount);
  const [showFull, setShowFull] = useState(false);
  const [up, setUp] = useState(props.upvoted);
  const [down, setDown] = useState(props.downvoted);
  const [deleted, setDeleted] = useState(null);
  const [loading, setLoading] = useState(false);

  const upHandler = () => {
    Axios.get(`/social/posts/${props.postId}/upvote`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        setUpvotes(res.data.data.upVoteCount);
        setDownvotes(res.data.data.downVoteCount);
        setUp(!up);
        setDown(false);
      }
    });
  };

  const downHandler = () => {
    Axios.get(`/social/posts/${props.postId}/downvote`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        setDownvotes(res.data.data.downVoteCount);
        setUpvotes(res.data.data.upVoteCount);
        setDown(!down);
        setUp(false);
      }
    });
  };

  const togglePostHandler = () => setShowFull((prev) => !prev);

  const calculateTime = (now, origin) => {
    let createdAt = (now - origin) / 1000;
    if (createdAt < 60) return `${Math.floor(createdAt)} seconds ago`;
    createdAt /= 60;
    if (createdAt < 60) return `${Math.floor(createdAt)} minute${createdAt >= 2 ? "s " : " "}ago`;
    createdAt /= 60;
    if (createdAt < 24) return `${Math.floor(createdAt)} hour${createdAt >= 2 ? "s " : " "}ago`;
    createdAt /= 24;
    if (createdAt < 30) return `${Math.floor(createdAt)} day${createdAt >= 2 ? "s " : " "}ago`;
    createdAt /= 30;
    if (createdAt < 12) return `${Math.floor(createdAt)} month${createdAt >= 2 ? "s " : " "}ago`;
    createdAt /= 12;
    return `${Math.floor(createdAt)} year${createdAt >= 2 ? "s " : " "}ago`;
  };

  const deletePostHandler = () => {
    setLoading(true);
    Axios.delete(`/social/posts/${props.postId}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then(() => {
      setDeleted(true);
      setLoading(false);
    });
  };

  const origin = Date.parse(props.date);
  const now = Date.now();
  const contentReduced = props.content.length > 820 ? props.content.slice(0, 820) + "..." : props.content;

  if (deleted) {
    return (
      <p className={classes.DeletedMsg}>
        <i className="far fa-trash-alt" style={{ color: "red" }}></i> Post Deleted
      </p>
    );
  }

  return (
    <Aux>
      <div className={classes.Post}>
        {props.userPost && (
          <DropDown button={<i className="fas fa-ellipsis-v" aria-hidden="true"></i>}>
            <li className={classes.Options}>
              <Link style={{ textDecoration: "none" }} to={`/${props.postId}/edit`}>
                <p>Edit Post</p>
              </Link>
            </li>
            <li className={classes.Options} onClick={deletePostHandler}>
              <p>Delete Post</p>
            </li>
          </DropDown>
        )}

        <div className={classes.Title}>{props.title}</div>
        <div className={classes.Time}>
          created by
          <span
            className={classes.Username}
            onClick={props.createdBy !== "[deleted]" ? props.userClick : null}
          >
            {" "}{props.createdBy}
          </span>, {calculateTime(now, origin)}
        </div>

        <div className={classes.Content}>
          {!showFull ? contentReduced : props.content}
        </div>

        <span className={classes.Votes}>
          <hr />
          <Votes
            postId={props.postId}
            upvotes={upvotes}
            downvotes={downvotes}
            up={up}
            down={down}
            upHandler={upHandler}
            downHandler={downHandler}
          />
        </span>

        {props.content.length > 820 && (
          <ToggleFullPost togglePost={togglePostHandler} full={showFull} />
        )}
      </div>
    </Aux>
  );
};

export default withRouter(Post);