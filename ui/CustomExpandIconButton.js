import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  button: {
    padding: 0
  },
  transition: {
    transition: "all ease .5s 0s"
  },
  open: {
    transform: "rotate(180deg)"
  }
});

function CustomExpandIconButton(props) {
  const { onClick, isExpand } = props;

  const classes = useStyles();

  return (
    <IconButton onClick={onClick} className={classes.button}>
      <ExpandMoreIcon
        className={`${classes.transition} ${isExpand && classes.open}`}
      />
    </IconButton>
  );
}

export default React.memo(CustomExpandIconButton);
