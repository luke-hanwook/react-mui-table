import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  body: {
    fontSize: "1rem",
    padding: `5px 5px`
  }
});

function CustomLink(props) {
  const {
    link: { href, style },
    handleLink,
    property,
    d,
    detail
  } = props;
  const classes = useStyles();

  const onClick = useCallback(
    e => {
      e.stopPropagation();
      handleLink({ data: detail || d, property });
    },
    [handleLink, detail, d]
  );

  return (
    <div className={classes.body}>
      {href ? (
        <a href={props.link.href} target={"_blank"}>
          {props.children}
        </a>
      ) : (
        <button style={style} onClick={onClick}>
          {props.children}
        </button>
      )}
    </div>
  );
}

export default CustomLink;
