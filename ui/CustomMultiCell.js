import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  height: {
    // minHeight: 30,
    height: 30,
    wordBreak: "break-all",
    borderBottom: "1px solid #dedede",
    lineHeight: 2
  },
  noneBorder: {
    borderBottom: "none"
  }
});

function CustomMultiCell(props) {
  const { children, lastNode } = props;
  const classes = useStyles();

  const className = lastNode ? classes.noneBorder : "";

  return <div className={`${classes.height} ${className}`}>{children}</div>;
}

export default CustomMultiCell;
