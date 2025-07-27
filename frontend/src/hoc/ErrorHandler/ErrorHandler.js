import React, { useEffect, useState } from "react";
import Modal from "../../Components/UI/Modal/Modal";
import Aux from "../Auxilliary/Auxilliary";
import Axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

const errorHandler = (WrappedComponent) => {
  return (props) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
      const reqInterceptor = Axios.interceptors.request.use((req) => {
        setHasError(false);
        setError(null);
        return req;
      });

      const resInterceptor = Axios.interceptors.response.use(
        (res) => res,
        (err) => {
          setError(err);
          setHasError(true);
          return Promise.reject(err); // Important to reject to preserve behavior
        }
      );

      // Cleanup interceptors on unmount
      return () => {
        Axios.interceptors.request.eject(reqInterceptor);
        Axios.interceptors.response.eject(resInterceptor);
      };
    }, []);

    const closeErrorHandler = () => {
      setHasError(false);
      setError(null);
    };

    let err = { message: null, statusCode: null };

    if (error?.response) {
      err.statusCode = error.response.status;
      err.message = error.response.data?.status;
    }

    if (err.message === "jwt expired") {
      err.message = "Session Expired. Please Log In Again";
      err.statusCode = 401;
    }

    const shouldShowModal =
      location.pathname === "/" ||
      location.pathname.startsWith("/user/") ||
      location.pathname.startsWith("/me");

    return (
      <Aux>
        {hasError && shouldShowModal && (
          <Modal show clicked={closeErrorHandler} type="msgModal">
            <i className="fas fa-ban" style={{ color: "red" }}></i>{" "}
            {err.message}
            <br />
          </Modal>
        )}
        <WrappedComponent {...props} errormsg={err.message} />
      </Aux>
    );
  };
};

export default errorHandler;
