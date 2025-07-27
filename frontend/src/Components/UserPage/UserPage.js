import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { withCookies } from "react-cookie";

import Posts from "../../Containers/Posts/Posts";
import fetchAPI from "../../fetchAPI";

import classes from "./UserPage.module.css";
import userImg from "../../assets/img/userImg.png";
import Spinner from "../UI/Spinner/Spinner";
import Aux from "../../hoc/Auxilliary/Auxilliary";

const UserPage = (props) => {
  const { cookies } = props;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = userId
          ? `/social/users/${userId}`
          : `/social/users/me`;

        const res = await fetchAPI.get(url, { credentials: 'include' });

        if (res.status === 200) {
          setUser(res.data.data);
        } else {
          setTimeout(() => {
            history.push("/authenticate");
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          history.push("/authenticate");
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, history]);

  const userloggedIn = cookies.get("userLogin");

  let updateInfo = null;
  if (userloggedIn && user && user._id === userloggedIn._id) {
    updateInfo = (
      <Link className={classes.UpdateInfo} to="/updateMe">
        Update Info
      </Link>
    );
  }

  return (
    <Aux>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className={classes.UserPanel}>
            <div className={classes.userNameImg}>
              <img
                src={userImg}
                className={classes.img}
                width="180px"
                alt="user"
              />
              <p className={classes.Name}>{user?.name}</p>
            </div>
            <div className={classes.Divider}></div>
            <div className={classes.UserInfo}>
              <p className={classes.Username}>u/{user?.username}</p>
              <span className={classes.Info}>
                Joined {new Date(user?.createdAt).toDateString()}
                <br />
              </span>
              <span className={classes.Info}>
                {user?.posts?.length || 0} Posts
                <br />
              </span>
              {updateInfo}
            </div>
          </div>
          <Posts user={user?._id || null} />
        </div>
      )}
    </Aux>
  );
};

export default withCookies(UserPage);
