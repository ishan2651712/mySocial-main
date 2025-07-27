import React, { useState } from "react";
import Toolbar from "./../Navigation/Toolbar/Toolbar";
import Aux from "../../hoc/Auxilliary/Auxilliary";
import SideDrawer from "./../Navigation/SideDrawer/SideDrawer";
import Axios from "axios";
import Modal from "../UI/Modal/Modal";
import { withRouter } from "react-router-dom";

const Layout = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState(null);

  const logoutHandler = () => {
    Axios({
      method: "GET",
      url: "/social/users/logout",
      withCredentials: true,
    }).then((res) => {
      props.cookies.remove("userLogin");

      setShowModal(true);
      setModalMsg("Logged Out Successfully");

      setTimeout(() => {
        props.history.push("/authenticate");
      }, 1000);
    });
  };

  const modalClosedHandler = () => {
    setShowModal(false);
    setModalMsg(null);
  };

  const toggleSideBar = () => {
    setShowSideDrawer((prev) => !prev);
  };

  return (
    <Aux>
      <Toolbar
        logout={logoutHandler}
        cookies={props.cookies}
        toggleSideBar={toggleSideBar}
      />
      <SideDrawer cookies={props.cookies} open={showSideDrawer} />
      {props.children}
      <Modal show={showModal} clicked={modalClosedHandler} type="msgModal">
        {modalMsg}
      </Modal>
    </Aux>
  );
};

export default withRouter(Layout);
