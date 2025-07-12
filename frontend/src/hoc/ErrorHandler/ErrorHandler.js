import React, { Component } from "react";
import Modal from "./../../Components/UI/Modal/Modal";
import Aux from "./../Auxilliary/Auxilliary";
import Axios from "axios";
import { withRouter } from "react-router-dom";

const errorHandler = (WrappedComponent) => {
  return withRouter(
    class extends Component {
      state = {
        hasError: false,
        error: null,
      };

      componentDidMount() {
        Axios.interceptors.request.use((req) => {
          this.setState({ hasError: false, error: null });
          return req;
        });

        Axios.interceptors.response.use(
          (res) => {
            // console.log(res);
            return res;
          },
          (err) => {
            // console.log(err);
            this.setState({ error: err, hasError: true });
            return err;
          }
        );
      }

      closeErrorHandler = () => {
        this.setState({
          error: null,
          hasError: false,
        });
      };

      render() {
        let err = { message: null, statusCode: null },
          modal;
        if (this.state.error) {
          console.error(this.state.error);
          if (this.state.error.response) {
            if (this.state.error.response.data) {
              err.statusCode = this.state.error.response.status;
              err.message = this.state.error.response.data.status;
            }
          }
          // else {
          //     err.message = "Network Error, Please Try Again Later"
          //     err.statusCode = 500;
          // }
          if (err.message === "jwt expired") {
            err.message = "Session Expired. Please Log In Again";
            err.statusCode = 401;
          }
        }
        if (this.state.hasError) {
          modal = (
            <Modal show clicked={this.closeErrorHandler} type="msgModal">
              <i class="fas fa-ban" style={{ color: "red" }}></i>

              {" " + err.message}
              <br></br>
            </Modal>
          );
        }
        return (
          <Aux>
            {/* {console.log(err)} */}
            {this.props.location.pathname === "/" ||
            this.props.location.pathname.startsWith("/user/") ||
            this.props.location.pathname.startsWith("/me")
              ? modal
              : null}
            <WrappedComponent {...this.props} errormsg={err.message} />
          </Aux>
        );
      }
    }
  );
};

export default errorHandler;
