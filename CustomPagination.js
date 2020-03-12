import React, { useCallback, useEffect } from "react";
import TablePagination from "@material-ui/core/TablePagination";
import useCustomContext from "./useCustomContext";
import CustomPaginationUi from "./ui/CustomPaginationUi";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    borderBottom: "none"
  },
  pagination: {
    color: "#3a3a3a"
  },
  space: {
    flex: "none"
  },
  regular: {
    padding: 0
  },
  select: {
    // paddingRight: 25
    textAlignLast: "left"
  },
  selectRoot: {
    marginLeft: 0,
    width: "92px",
    border: "1px solid #d4d4d5"
  },
  selectIcon: {
    // background: "linear-gradient(#f1f1f1, #dfdfdf)",
    // fontSize: "2rem",
    // borderLeft: "1px solid #d4d4d5",
    // top: "0px",
    // right: "0px",
    // bottom: "0px"
    position: "absolute",
    // background: "linear-gradient(#f1f1f1, #dfdfdf)",
    // borderLeft: "1px solid #d4d4d5",
    top: 0,
    right: 3,
    bottom: 0,
    // width: "1.96rem",
    height: "100%"
    // height: "1.75rem"
  }
});

function CustomPagination(props) {
  const { defaultPagination } = props;
  const {
    state: { page, rowsPerPage },
    actions: { onChangePage, onChangeRowsPerPage }
  } = useCustomContext("PaginationContext");

  const classes = useStyles();

  useEffect(() => {
    if (defaultPagination.page <= 0) {
      // console.log(defaultPagination);
      onChangePage(null, defaultPagination.page);
    }
  }, [defaultPagination]);

  const handlePagination = useCallback(
    (page, rowsPerPage) => {
      defaultPagination.handlePatination({
        page,
        rowsPerPage
      });
    },
    [defaultPagination]
  );

  const handleChangePage = useCallback(
    (e, page) => {
      onChangePage(e, page);
      handlePagination(page, rowsPerPage);
    },
    [onChangePage, handlePagination, rowsPerPage]
  );

  const handleChangeRowsPerPage = useCallback(
    e => {
      const num = Number(e.target.value);
      onChangePage(e, 0);
      onChangeRowsPerPage(e, num);
      handlePagination(0, num);
    },
    [onChangeRowsPerPage, handlePagination, onChangePage]
  );

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 20]}
      colSpan={props.colSpan}
      count={props.count}
      rowsPerPage={rowsPerPage}
      page={page}
      labelDisplayedRows={({ from, to, count }) =>
        `Showing ${from}-${to} of ${count} cases`
      }
      labelRowsPerPage={""}
      SelectProps={{ native: true }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      ActionsComponent={CustomPaginationUi}
      classes={{
        root: classes.root,
        caption: classes.pagination,
        input: classes.pagination,
        spacer: classes.space,
        toolbar: classes.regular,
        select: classes.select,
        selectRoot: classes.selectRoot,
        selectIcon: classes.selectIcon
      }}
    />
  );
}
export default CustomPagination;
