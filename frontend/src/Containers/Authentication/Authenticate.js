import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import Login from "../../Components/Login/Login";
import Signup from "../../Components/Signup/Signup";
import ForgotPassword from "../../Components/ForgotPassword/ForgotPassword";

const Authenticate = (props) => {
  const [loginEmail, setLoginEmail] = useState(false);
  const [signup, setSignup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const loginEmailHandler = () => {
    setLoginEmail((prev) => !prev);
    setForgotPassword(false);
  };

  const forgotPasswordHandler = () => {
    setForgotPassword(true);
  };

  const signupLoginToggleHandler = () => {
    setSignup((prev) => !prev);
    setForgotPassword(false);
  };

  if (signup) {
    return (
      <Signup
        login={signupLoginToggleHandler}
        errormsg={props.errormsg}
      />
    );
  }

  if (forgotPassword) {
    return (
      <ForgotPassword
        signup={signupLoginToggleHandler}
        login={loginEmailHandler}
        errormsg={props.errormsg}
      />
    );
  }

  return (
    <Login
      loginEmail={loginEmailHandler}
      loginType={loginEmail ? "email" : "username"}
      signup={signupLoginToggleHandler}
      forgotPassword={forgotPasswordHandler}
      cookies={props.cookies}
      errormsg={props.errormsg}
    />
  );
};

export default withRouter(Authenticate);
