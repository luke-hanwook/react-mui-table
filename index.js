import React, { useMemo, useRef } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import CustomCell from "./CustomCell";
import CustomRow from "./CustomRow";
import CustomPagination from "./CustomPagination";
import BodyRowContainer from "./BodyRowContainer";
import withContext from "./withContext";
import Checkbox from "./ui/CustomCheckBox";
import OrderIcon from "./ui/CustomOrderIcon";
import ScrollContainer from "./ScrollContainer";
import Loader from "assets/images/patient/ajax-loader.gif";

function Tfooter({ defaultPagination, columns, rowCount }) {
  const isDefaultPagination =
    defaultPagination && Object.keys(defaultPagination).length > 0;

  // console.log(isDefaultPagination, rowCount, defaultPagination, columns);

  const pagenation = useMemo(() => {
    // console.log("page", isDefaultPagination);
    //TODO: defulatPagination undefined 처리 랜더링 등등,,,
    return (
      isDefaultPagination && (
        <CustomPagination
          // handlePatination={defaultPagination.handlePatination}
          colSpan={columns.length + 1}
          count={rowCount}
          defaultPagination={defaultPagination}
        />
      )
    );
  }, [
    isDefaultPagination,
    columns.length,
    rowCount,
    defaultPagination
    // loading
  ]);
  return (
    <TableFooter>
      <CustomRow rowType="footer">{pagenation}</CustomRow>
    </TableFooter>
  );
}

function Tbody(props) {
  const body = useMemo(() => {
    let colSpan = props.columns.length;
    if (props.selectRow || !props.hide) {
      colSpan++;
    }

    return (
      // <Loading loading={props.loading}>
      <TableBody>
        {props.data.length > 0 ? (
          props.data.map((d, i) => (
            <BodyRowContainer key={i} d={d} num={i} {...props} />
          ))
        ) : (
          <CustomRow>
            <CustomCell colSpan={colSpan} align="center">
              No data...
            </CustomCell>
          </CustomRow>
        )}
      </TableBody>
      // </Loading>
    );
  }, [props.data]);

  const content = useMemo(() => {
    // console.log(props.tt, props.loading, props.data);
    return props.defaultPagination &&
      props.defaultPagination.mode === "scroll" ? (
      <ScrollContainer {...props}>{body}</ScrollContainer>
    ) : (
      body
    );
  }, [props.data]);

  // return <Loading loading={props.loading}>{content}</Loading>;
  return content;
}

function Thead(props) {
  const {
    columns,
    selectRow,
    headerIcon,
    defaultSort,
    indexed,
    rowCount
  } = props;
  const cellType = "head";

  // FIXME: isSelectRow가 새로운 객체로 들어옴
  const isSelectRow = selectRow && Object.keys(selectRow).length > 0;
  const isDefaultSort = defaultSort && Object.keys(defaultSort).length > 0;
  const hide = selectRow && selectRow.hide;

  const checkCell = useMemo(() => {
    return (
      ((isSelectRow && !hide) || indexed) && (
        <CustomCell cellType={cellType} padding={"checkbox"} align="center">
          {!indexed &&
            (headerIcon || (
              <Checkbox
                checkType={cellType}
                injectContext={"SelectContext"}
                rowCount={rowCount}
              />
            ))}
        </CustomCell>
      )
    );
  }, [headerIcon, isSelectRow, rowCount]);

  const headerCellList = useMemo(() => {
    return columns.map((c, i) => {
      const { column, sort, align, style, title } = c;
      return (
        <CustomCell
          key={i}
          cellType={cellType}
          align={align}
          style={style && style.head}
          right={
            // TODO: 랜더링 분리 because handelSort
            isDefaultSort &&
            sort && (
              <OrderIcon
                injectContext={"SortContext"}
                c={c}
                handleSort={defaultSort.handleSort}
              />
            )
          }
        >
          <div title={title}>{column}</div>
        </CustomCell>
      );
    });
  }, [columns, isDefaultSort, defaultSort]);

  const headRow = useMemo(() => {
    return (
      <CustomRow rowType={cellType} {...props}>
        {checkCell}
        {headerCellList}
      </CustomRow>
    );
  }, [checkCell, headerCellList]);

  return <TableHead>{headRow}</TableHead>;
}

function CustomTable(props) {
  const divEl = useRef(null);
  const { id, stickyHeader, header, ...rest } = props;
  //FIXME: console.log(props.state); //이쪽데이터를 쓰도록 수정해야함

  const table = useMemo(() => {
    const isHiddenPagination =
      props.defaultPagination &&
      (props.defaultPagination.mode === "scroll" ||
        props.defaultPagination.mode === "more");

    // console.log("props.loading", props.tt, props.loading, props.parentEl);
    // divEl.current && console.log("divEl.current", divEl.current.clientHeight);

    return (
      <div style={{ position: "relative" }}>
        <Table
          id={id}
          stickyHeader={stickyHeader}
          // style={{ borderCollapse: "collapse" }}
        >
          {header || <Thead {...rest} {...props.state} />}
          <Tbody {...rest} />
          {props.data.length > 0 && !isHiddenPagination && (
            <Tfooter {...rest} {...props.state} />
          )}
        </Table>
        {props.loading !== undefined && !props.loading && (
          <div
            ref={divEl}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: "#fff",
              opacity: 0.7,
              zIndex: 50,
              display: "flex",
              justifyContent: "center"
            }}
          >
            <img
              src={Loader}
              alt=""
              style={{
                width: "1.5rem",
                height: "1.5rem",
                position: "sticky",
                top: props.parentEl ? props.parentEl.clientHeight / 2 : 39,
                // top: divEl.current ? divEl.current.clientHeight / 2 : 0,
                left: 0
              }}
            />
          </div>
        )}
      </div>
    );
  }, [id, props.defaultPagination, props.state, stickyHeader, header, rest]);

  return table;
}

export default withContext(CustomTable);
