import React, { useMemo, useCallback } from "react";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%"
  },
  div: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #dedede"
  },
  button: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRight: "1px solid #dedede",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#3a3a3a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem"
  },
  selected: {
    backgroundColor: "#e4e4e4"
  },
  endButton: {
    padding: "1px 0px"
  },
  textButton: {
    width: "50px",
    minWidth: "50px"
  },
  lastButton: {
    borderRight: "none"
  },
  icon: {
    fontSize: "1.2rem"
  }
});

function CustomPaginationUi(props) {
  const { page, onChangePage, count, rowsPerPage } = props;

  const classes = useStyles();

  const handleFirstPageButtonClick = useCallback(
    e => {
      onChangePage(e, 0);
    },
    [onChangePage]
  );

  const handleLastPageButtonClick = useCallback(
    e => {
      onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    },
    [onChangePage, count, rowsPerPage]
  );

  const handleBackButtonClick = useCallback(
    e => {
      onChangePage(e, page - 1);
    },
    [onChangePage, page]
  );

  const handleNextButtonClick = useCallback(
    e => {
      onChangePage(e, page + 1);
    },
    [onChangePage, page]
  );

  const handleButtonClick = useCallback(
    e => {
      onChangePage(e, Number(e.currentTarget.value) - 1);
    },
    [onChangePage]
  );

  const numList = useMemo(() => {
    const pageGroupSize = 5;
    let totPages = Math.ceil(count / rowsPerPage);
    const updatePage = Math.floor(pageGroupSize / 2);
    let endPage = 0,
      startPage = 0;

    if (page < Math.ceil(pageGroupSize / 2)) {
      endPage = pageGroupSize;
      startPage = endPage - pageGroupSize + 1;
    } else if (totPages - updatePage < page + 1) {
      endPage = totPages;
      startPage = totPages - pageGroupSize + 1;
    } else {
      startPage = page - updatePage + 1;
      endPage = page + updatePage + 1;
    }

    if (endPage > totPages) {
      endPage = totPages;
    }

    if (startPage < 1) {
      startPage = 1;
    }

    const numList = [];
    for (let i = startPage; i <= endPage; i++) {
      numList.push(i);
    }

    return numList.map(d => {
      const className =
        page === d - 1 ? `${classes.button} ${classes.selected}` : `${classes.button}`;
      return (
        <button
          onClick={handleButtonClick}
          disabled={page === d - 1}
          key={d}
          value={d}
          className={className}
        >
          {d}
        </button>
      );
    });
  }, [count, page, rowsPerPage, handleButtonClick, classes.button, classes.selected]);

  return (
    <div className={classes.pagination}>
      <div className={classes.div}>
        <button
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          className={`${classes.button} ${classes.endButton}`}
        >
          <FirstPageIcon className={classes.icon} />
        </button>
        <button
          onClick={handleBackButtonClick}
          disabled={page === 0}
          className={`${classes.button} ${classes.textButton}`}
        >
          Prev
        </button>

        {numList}

        <button
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          className={`${classes.button} ${classes.textButton}`}
        >
          Next
        </button>
        <button
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          className={`${classes.button} ${classes.endButton} ${classes.lastButton}`}
        >
          <LastPageIcon className={classes.icon} />
        </button>
      </div>
    </div>
  );
}

export default CustomPaginationUi;
