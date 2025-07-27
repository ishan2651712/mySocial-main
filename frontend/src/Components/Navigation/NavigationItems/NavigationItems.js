import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import { withCookies } from 'react-cookie';
import UserNav from './UserNav/UserNav';
import { withRouter } from 'react-router-dom';

const NavigationItems = (props) => {
  const userLoggedin = props.cookies.get('userLogin');

  let user = <NavigationItem link='/authenticate'>Login</NavigationItem>;

  if (userLoggedin) {
    user = (
      <UserNav
        active={props.location.pathname === "/me"}
        logout={props.logout}
      >
        {userLoggedin.username} <i className="fas fa-angle-down"></i>
      </UserNav>
    );
  }

  return (
    <div className={classes.NavigationItems}>
      <NavigationItem link='/' exact>Home</NavigationItem>
      {user}
    </div>
  );
};

export default withCookies(withRouter(NavigationItems));
