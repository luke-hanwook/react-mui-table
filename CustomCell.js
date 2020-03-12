import React, { useMemo } from "react";
import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  th: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
    // minHeight: 30
  },
  head: {
    fontWeight: 600,
    color: "#3a3a3a",
    backgroundColor: "#f3f3f3",
    borderTop: "1px solid #dedede"
  },
  root: {
    // minHeight: 30,
    height: 30,
    fontSize: "1rem",
    borderLeft: "1px solid #dedede",
    "&:last-child": {
      borderRight: "1px solid #dedede"
    }
    // border: "1px solid #dedede"
  },
  paddingCheckbox: {
    width: 35,
    padding: 0
  }
});

function CustomCell(props) {
  const { children, right, left } = props;
  const { padding, align, style, colSpan } = props;
  const { cellType } = props;

  const classes = useStyles();

  const content = useMemo(() => {
    // console.log("cell render", cellType);
    let defaultCell = (
      <>
        {left}
        {children}
        {right}
      </>
    );

    if (cellType === "head") {
      defaultCell = <div className={classes.th}>{defaultCell}</div>;
    }

    return defaultCell;
  }, [cellType, classes.th, right, left, children]);

  const cell = useMemo(() => {
    return (
      <TableCell
        variant={cellType}
        padding={padding || "none"}
        align={align}
        colSpan={colSpan}
        style={style}
        classes={{
          root: classes.root,
          head: classes.head,
          paddingCheckbox: classes.paddingCheckbox
        }}
      >
        {content}
      </TableCell>
    );
  }, [
    align,
    colSpan,
    padding,
    cellType,
    style,
    classes.root,
    classes.head,
    classes.paddingCheckbox,
    content
  ]);

  return cell;
}

export default React.memo(CustomCell);
