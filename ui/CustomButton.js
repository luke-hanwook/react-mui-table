import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  button: {
    display: "flex",
    flexDirection: "column",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0
  }
});

const CustomButton = ({ onClick, children }) => {
  const classes = useStyles();
  return (
    <button onClick={onClick} className={classes.button}>
      {children}
    </button>
  );
};

export default CustomButton;
