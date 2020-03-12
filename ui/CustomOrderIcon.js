import React, { useMemo, useCallback } from "react";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import useCustomContext from "../useCustomContext";
import CustomButton from "./CustomButton";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  icon: {
    fontSize: "1.4rem"
    // position: "absolute"
  },
  disabled: {
    color: "#D3D3D3"
  },
  up: {
    top: 5
  },
  down: {
    top: 10
  }
});

const CustomOrderIcon = ({ injectContext, c: { property }, handleSort }) => {
  const { state, actions } = useCustomContext(injectContext);
  const classes = useStyles();
  const isOrderBy = property === state.orderBy;
  const doRender = property === state.orderBy && state.isAsc;

  const onClick = useCallback(
    e => {
      actions.onClickOrderButton(property);
      handleSort({
        orderBy: property,
        order: actions.getOrder()
      });
    },
    [actions, property, handleSort]
  );

  const orderIcon = useMemo(() => {
    return isOrderBy ? (
      <>
        {doRender ? (
          <ArrowDropUp className={`${classes.icon} ${classes.up}`} />
        ) : (
          <ArrowDropDown className={`${classes.icon} ${classes.down}`} />
        )}
      </>
    ) : (
      <>
        <ArrowDropUp
          className={`${classes.icon} ${classes.disabled} ${classes.up}`}
        />
        <ArrowDropDown
          className={`${classes.icon} ${classes.disabled}  ${classes.down}`}
        />
      </>
    );
  }, [isOrderBy, doRender, classes]);

  const icon = useMemo(() => {
    // console.log("icon");
    return (
      handleSort && <CustomButton onClick={onClick}>{orderIcon}</CustomButton>
    );
  }, [onClick, orderIcon, handleSort]);

  return <>{icon}</>;
};

export default CustomOrderIcon;
