import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";

import Post from "../../Components/Post/Post";
import Axios from "../../axios";
import Spinner from "../../Components/UI/Spinner/Spinner";
import SortBy from "../../Components/SortBy/SortBy";
import CreatePostButton from "../../Components/CreatePost/CreatePostButton";
import UserCard from "../../Components/UserCard/UserCard";
import Aux from "../../hoc/Auxilliary/Auxilliary";

const Posts = (props) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortby, setSortby] = useState("-createdAt");
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState(null);

  const userId = props.user;

  const fetchPosts = (sortQuery = sortby) => {
    setLoading(true);
    Axios({
      method: "GET",
      url: `/social/posts?sort=${sortQuery}${
        userId ? `&user=${userId}` : ""
      }`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then((res) => {
        setPosts(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const userShowHandler = (id) => {
    if (id) {
      setShowUser(true);
      Axios.get(`/social/users/${id}`).then((res) => {
        if (res.data) {
          setUser(res.data.data);
        }
      });
    } else {
      setShowUser(false);
      setUser(null);
    }
  };

  const optionChangeHandler = (event) => {
    let sortVal = event.target.value;
    let query =
      sortVal === "createdAt"
        ? sortVal
        : `${sortVal},-createdAt`;

    setSortby(query);
    fetchPosts(query);
  };

  const createPostHandler = () => {
    props.history.push("/createPost");
  };

  let postList = <Spinner />;
  const userLoggedIn = props.cookies.get("userLogin");
  const loggedInId = userLoggedIn ? userLoggedIn.id : " ";

  if (!loading && posts) {
    postList = posts.map((el) => {
      let userUpvote = el.upvotes.some((e) => e._id === loggedInId);
      let userDownvote = el.downvotes.some((e) => e._id === loggedInId);
      let userPost = el.user && el.user._id === loggedInId;

      return (
        <Post
          key={el._id}
          postId={el._id}
          title={el.title}
          content={el.content}
          createdBy={el.user ? el.user.username : "[deleted]"}
          date={el.createdAt}
          userClick={() => userShowHandler(el.user?._id)}
          upvoteCount={el.upVoteCount}
          downvoteCount={el.downVoteCount}
          upvoted={userUpvote}
          downvoted={userDownvote}
          userPost={userPost}
        />
      );
    });
  }

  return (
    <div>
      {posts ? (
        posts.length >= 1 ? (
          <Aux>
            {props.history.location.pathname === "/" && (
              <CreatePostButton clicked={createPostHandler} />
            )}
            <SortBy optionChange={optionChangeHandler} />
          </Aux>
        ) : (
          <p style={{ textAlign: "center" }}>No posts yet :(</p>
        )
      ) : null}
      {postList}
      {showUser && <UserCard clicked={() => userShowHandler(null)} user={user} />}
    </div>
  );
};

export default withRouter(withCookies(Posts));
