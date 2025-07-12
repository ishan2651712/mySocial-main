import React, { Component } from "react";
import classes from "./ForgotPassword.module.css";
import Axios from "../../axios";

import { withRouter } from "react-router-dom";
import Spinner from "./../UI/Spinner/Spinner";
import { withCookies } from "react-cookie";

class forgotPassword extends Component {
  state = {
    status: this.props.errormsg,
    forgotPassword: null,
    resetPassword: null,
    loading: null,
    disabled: true,
  };
  resetPasswordHandler = (event) => {
    event.preventDefault();
    let password = document.getElementsByName("password")[0].value;
    let passwordConfirm =
      document.getElementsByName("passwordConfirm")[0].value;
    let token = document.getElementsByName("token")[0].value;
    Axios({
      method: "PATCH",
      url: `/social/users/resetPassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
        token: token,
      },
    }).then((res) => {
      if (res.data) {
        let cookies = this.props.cookies;
        cookies.set("userLogin", res.data.data);

        this.setState({
          status: "Password Updated Successfully",
          resetPassword: true,
        });

        setTimeout(() => {
          this.props.history.push("/");
        }, 1000);
      } else {
        this.setState({
          status: this.props.errormsg,
          resetPassword: false,
          loading: false,
        });
      }
    });
  };

  forgotPasswordHandler = (event) => {
    this.setState({ loading: true });
    event.preventDefault();
    let email = document.getElementsByName("email")[0].value;
    Axios({
      method: "POST",
      url: `/social/users/forgotPassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
      },
      withCredentials: true,
    }).then(
      (res) => {
        if (res.data) {
          this.setState({
            status: res.data.message,
            forgotPassword: true,
            loading: false,
          });
        } else {
          this.setState({
            status: this.props.errormsg,
            forgotPassword: false,
            loading: false,
          });
        }

        // else {
        //   this.setState({
        //     forgotPassword: false,
        //     status: "Network Error, Please try after a while",
        //     loading: false,
        //   });
        // }
      }
      //no point of writing catch block...
    );
  };
  render() {
    let attachedClasses = [];
    let content;
    if (this.state.forgotPassword) {
      attachedClasses.push(classes.Green);
    } else {
      attachedClasses.push(classes.Red);
    }

    if (this.state.resetPassword === false) {
      attachedClasses.pop(classes.Green);
      attachedClasses.push(classes.Red);
    }

    if (this.state.loading === true) {
      content = <Spinner />;
    } else
      content = (
        <form className={classes.loginform}>
          {this.state.forgotPassword ? null : (
            <input type="text" placeholder="email" name="email" />
          )}
          {this.state.forgotPassword ? (
            <div>
              <input type="text" placeholder="token" name="token" />
              <input
                type="password"
                placeholder="New Password"
                name="password"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="passwordConfirm"
              />
            </div>
          ) : null}
          {this.state.forgotPassword ? (
            <button onClick={this.resetPasswordHandler}>reset password</button>
          ) : (
            <button onClick={this.forgotPasswordHandler}>
              forgot password
            </button>
          )}
          <span class={attachedClasses.join(" ")}>
            {this.state.forgotPassword === null ? " " : this.state.status}
          </span>
          <p className={classes.message} onClick={this.props.login}>
            Log-in
          </p>

          <p className={classes.message} onClick={this.props.signup}>
            Not registered? Create an account
          </p>
        </form>
      );
    return (
      <div className={classes.loginpage}>
        <div className={classes.form}>{content}</div>
      </div>
    );
  }
}

export default withCookies(withRouter(forgotPassword));
