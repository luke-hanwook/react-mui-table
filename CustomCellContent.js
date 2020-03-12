import React, { useMemo } from "react";
import CustomExcute from "./ui/CustomExcute";
import CustomLink from "./ui/CustomLink";
import CustomInput from "./ui/CustomInput";
import CustomMultiCell from "./ui/CustomMultiCell";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  body: {
    fontSize: "1rem",
    wordBreak: "break-all",
    padding: "5px 5px",
    display: "inline-block"
  }
});

const dataFormat = (str, title) => {
  let retStr = str;

  if (typeof str === "number") {
    const regexp = /\B(?=(\d{3})+(?!\d))/g;
    return Number(retStr)
      .toString()
      .replace(regexp, ",");
  }

  if (typeof str === "boolean") {
    return String(retStr);
  }

  if (!title && typeof str === "string" && str.length > 30) {
    return `${str.slice(0, 27)}...`;
  }

  if (title && typeof str === "object") {
    return "";
  }

  if (!str) {
    return "-";
  }

  return retStr;
};

// TODO: rendering
function CustomCellContent(props) {
  const {
    d,
    detail,
    property,
    options,
    options: { link, isEditable, withCellExcute },
    handleLink
  } = props;

  const value = detail ? detail[property] : d[property];
  let children = value;

  const classes = useStyles();

  const RComponent = useMemo(() => {
    const make = Component => props => {
      // console.log("props", props);
      if (!Array.isArray(children)) {
        return (
          <Component {...props} {...options} value={children}>
            {dataFormat(children)}
          </Component>
        );
      }

      return children.map((value, i) => {
        return (
          <CustomMultiCell lastNode={children.length - 1 === i} key={i}>
            <Component {...props} {...options} value={value}>
              {dataFormat(value)}
            </Component>
          </CustomMultiCell>
        );
      });
    };

    const defaultCell = ({ children }) => {
      // const title = typeof value !== "string" ? value.toString() : value;
      const title = dataFormat(value, "title");

      return (
        <div className={classes.body} title={title}>
          {children}
        </div>
      );
    };

    let component = make(defaultCell)();

    if (withCellExcute) {
      component = make(CustomExcute)(props);
    }

    if (link.isLinked) {
      component = make(CustomLink)(props);
    }

    if (isEditable) component = make(CustomInput)(props);

    return component;
  }, [
    value,
    isEditable,
    link.isLinked,
    withCellExcute,
    classes.body,
    children,
    options
  ]);

  return RComponent;
}

export default React.memo(CustomCellContent);
