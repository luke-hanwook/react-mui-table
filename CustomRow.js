import React, { useCallback, useMemo } from "react";
import TableRow from "@material-ui/core/TableRow";
import useCustomContext from "./useCustomContext";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  head: {
    backgroundColor: "#f3f3f3"
  },
  footer: {
    backgroundColor: "none"
  },
  root: {
    // minHeight: 30
    height: 30
  },
  oddRoot: {
    // minHeight: 30,
    backgroundColor: "#f9f9f9",
    height: 30,
    "&:nth-of-type(odd)": {
      backgroundColor: "#fff"
    },
    "&$selected": {
      "& td": { color: "#3a3a3a" },
      backgroundColor: "#cff2ff"
    }
  },
  selected: {}
});

function CustomRow(props) {
  const { rowType, d, detail, selectRow, oddRow, headerIcon } = props;
  const { children } = props;

  const { actions } = useCustomContext("SelectContext");
  const classes = useStyles();
  // const className = rowType ? classes[rowType] : "";

  let isItemSelected = false;
  if (selectRow) {
    if (rowType === "head" || rowType === "footer") isItemSelected = false;
    else if (rowType === "body") {
      isItemSelected = actions.isSelected(d);
    } else isItemSelected = actions.isDetailsSelected(detail);
  }

  const handleClickRow = useCallback(
    e => {
      if (
        // rowType === "head" ||
        !selectRow ||
        (selectRow.mode === "radio" && rowType === "head") ||
        rowType === "footer" ||
        selectRow.mode === "none"
      ) {
        return;
      } else {
        if (selectRow) {
          // FIXME: handleClickCheckbox가 ture이지만 클릭되지 않아야 하는 조건
          // 1. if selected === maxSelectCount then true
          // 3. if selected.hasOwnProperty('d.id') then false
          // 4. if mode === 'checkbox'
          if (rowType === "head") {
            actions.onSelectAllClick(e);
          } else if (rowType === "body") actions.handleClickRow(e, d);
          else actions.handleClickDetailRow(e, detail);

          if (selectRow.handleClickCheckbox) {
            const { handleClickCheckbox } = selectRow;
            actions.handleClickCheckbox(handleClickCheckbox, detail || d);
          }
        }
      }
    },
    [actions, rowType, d, detail, selectRow]
  );

  const className = detail ? `${d.id}-detail` : "";

  const row = useMemo(() => {
    return (
      <TableRow
        // hover={rowType === "body"}
        className={className}
        variant={rowType}
        selected={isItemSelected}
        onClick={handleClickRow}
        classes={{
          root: oddRow ? classes.oddRoot : classes.root,
          selected: classes.selected,
          head: classes.head
        }}
      >
        {children}
      </TableRow>
    );
  }, [
    children,
    handleClickRow,
    isItemSelected,
    classes.root,
    classes.selected,
    classes.head,
    classes.oddRoot,
    oddRow,
    rowType,
    className
  ]);

  return row;
}

export default React.memo(CustomRow);
