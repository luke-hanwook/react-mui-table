import React, { useMemo } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import useCustomContext from "../useCustomContext";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    padding: 0
  },
  checked: {
    color: "#14a4e7"
  }
});

const CustomCheckBox = ({
  checkType,
  injectContext,
  rowCount,
  d,
  detail,
  selectRow,
  style
}) => {
  const {
    state: { selected },
    actions
  } = useCustomContext(injectContext);

  const classes = useStyles();
  const selectNum = Object.keys(selected).length;
  const indeterminate = checkType && selectNum > 0 && selectNum < rowCount;
  const checkBoxClass = { root: classes.root, checked: classes.checked };

  let checked = false;
  if (checkType === "head") {
    checked = selectNum === rowCount && rowCount > 0;
  } else if (checkType === "body") {
    checked = actions.isSelected(d);
  } else checked = actions.isDetailsSelected(detail);

  const isDetailDisable = detail && actions.isSelected(d);
  const hide = selectRow && selectRow.hide;
  const maxSelectCount = selectRow && selectRow.maxSelectCount;

  const disabled =
    !isDetailDisable &&
    !checked &&
    maxSelectCount <= actions.getSelectedCount();

  const checkBox = useMemo(() => {
    return (
      !hide && (
        <Checkbox
          style={style}
          checked={checked}
          disabled={disabled}
          indeterminate={checkType === "head" && indeterminate}
          indeterminateIcon={<IndeterminateCheckBoxIcon fontSize="small" />}
          classes={checkBoxClass}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          color="default"
        />
      )
    );
  }, [checked, indeterminate, style, disabled]);

  return <>{checkBox}</>;
};

export default CustomCheckBox;
