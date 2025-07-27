import React, { useEffect, useState } from "react";
import Modal from "../../Components/UI/Modal/Modal";
import Aux from "../Auxilliary/Auxilliary";
import { useLocation, useHistory } from "react-router-dom";
import fetchAPI from "../../utils/fetchAPI"; // Import your existing fetchAPI function

const errorHandler = (WrappedComponent) => {
  return (props) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
      // Cleanup error states on unmount
      return () => {
        setHasError(false);
        setError(null);
      };
    }, []);

    const closeErrorHandler = () => {
      setHasError(false);
      setError(null);
    };

    // Customize error handling (similar to Axios)
    let err = { message: null, statusCode: null };

    if (error?.message) {
      err.message = error.message;
      err.statusCode = 500; // Default status code for an unknown error
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
            <i className="fas fa-ban" style={{ color: "red" }}></i> {err.message}
            <br />
          </Modal>
        )}
        <WrappedComponent {...props} errormsg={err.message} fetchAPI={fetchAPI} />
      </Aux>
    );
  };
};

export default errorHandler;
