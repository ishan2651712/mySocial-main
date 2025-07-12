import React, { Component } from "react";
import classes from "./UpdatePassword.module.css";
import Axios from "../../axios";

import { withRouter } from "react-router-dom";
import Spinner from "./../UI/Spinner/Spinner";
import { withCookies } from "react-cookie";

class UpdatePassword extends Component {
  state = {
    status: this.props.errormsg,
    updatePassword: null,
    loading: null,
    disabled: true,
  };

  updatePasswordHandler = (event) => {
    this.setState({ loading: true });
    event.preventDefault();
    let currentPassword =
      document.getElementsByName("currentPassword")[0].value;
    let updatedPassword =
      document.getElementsByName("updatedPassword")[0].value;
    let passwordConfirm =
      document.getElementsByName("passwordConfirm")[0].value;
    Axios({
      method: "PATCH",
      url: `/social/users/updatePassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        currentPassword: currentPassword,
        updatedPassword: updatedPassword,
        passwordConfirm: passwordConfirm,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        let cookies = this.props.cookies;
        cookies.set("userLogin", res.data.data);

        this.setState({
          status: "Password Updated Successfully",
          updatePassword: true,
          loading: false,
        });

        setTimeout(() => {
          this.props.history.push("/");
        }, 1000);
      } else {
        this.setState({
          status: this.props.errormsg,
          updatePassword: false,
          loading: false,
        });
      }
    });
  };

  render() {
    let attachedClasses = [];
    let content;
    if (this.state.updatePassword) {
      attachedClasses.push(classes.Green);
    } else {
      attachedClasses.push(classes.Red);
    }

    if (this.state.loading === true) {
      content = <Spinner />;
    } else
      content = (
        <form className={classes.loginform}>
          <div>
            <input
              type="password"
              placeholder="Current Password"
              name="currentPassword"
            />
            <input
              type="password"
              placeholder="New Password"
              name="updatedPassword"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              name="passwordConfirm"
            />
          </div>
          <button onClick={this.updatePasswordHandler}>update password</button>

          <span class={attachedClasses.join(" ")}>
            {this.state.updatePassword === null ? " " : this.state.status}
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

export default withCookies(withRouter(UpdatePassword));
