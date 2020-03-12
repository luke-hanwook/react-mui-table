import React, { useState, useMemo, useCallback } from "react";
import Edit from "../../../../assets/images/edit.svg";
import CustomSvg from "./CustomSvg";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  input: {
    maxWidth: "300px"
  },
  icon: {
    fontSize: "1rem"
  },
  button: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "gray"
  }
});

function CustomInput(props) {
  const { children, property, handleChangeInput, detail, d } = props;

  const [state, setState] = useState(false);
  const [text, setText] = useState(children);
  const classes = useStyles();

  const handleClick = useCallback(
    e => {
      e.stopPropagation();
      setState(!state);
      if (state) {
        handleChangeInput({
          property,
          data: detail || d,
          text: text
        });
      }
    },
    [state, text, property, handleChangeInput, d, detail]
  );

  const handleChange = useCallback(e => {
    const value = e.target.value;
    setText(value);
  }, []);

  const input = useMemo(() => {
    return state ? (
      <input type={"text"} value={text} onChange={handleChange} className={classes.input} />
    ) : (
      text
    );
  }, [state, text, handleChange, classes.input]);

  return (
    <>
      {input}
      {handleChangeInput && (
        <button onClick={handleClick} className={classes.button}>
          <CustomSvg src={Edit} />
          {state ? "Save" : "Edit"}
        </button>
      )}
    </>
  );
}

export default CustomInput;
