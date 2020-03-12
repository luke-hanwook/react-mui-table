import React from "react";
import withExcute from "../withExcute";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  body: {
    fontSize: "1rem",
    padding: `5px 5px`
  }
});

function CustomExcute(props) {
  const { children, style } = props;
  const classes = useStyles();

  return (
    <div style={style} className={classes.body}>
      {children}
    </div>
  );
}

export default withExcute(CustomExcute);
