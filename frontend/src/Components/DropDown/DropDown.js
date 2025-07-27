import React, { useState } from "react";
import DropDownButton from "./DropDownButton.js/DropDownButton";
import classes from "./DropDown.module.css";

const DropDown = (props) => {
  const [show, setShow] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);

  const btnClickHandler = () => {
    setShow((prev) => !prev);
    setBtnClicked((prev) => !prev);
  };

  return (
    <div className={classes.DropDown}>
      <DropDownButton clicked={btnClickHandler}>
        {props.button}
      </DropDownButton>

      {show ? (
        <div className={classes.Content}>
          <ul className={classes.Options}>{props.children}</ul>
        </div>
      ) : null}
    </div>
  );
};

export default DropDown;
