import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef
} from "react";
import CustomRow from "./CustomRow";
import CustomCell from "./CustomCell";
import Checkbox from "./ui/CustomCheckBox";
import CustomCellContent from "./CustomCellContent";
import CustomExpandIconButton from "./ui/CustomExpandIconButton";
import useScroll from "./useScroll";

const ROWS_PER_PAGE = 10;

// TODO: checkbox cell 분리
// TODO: infinity scroll 분리

function DetailCell({ index, detail, style, align, ...rest }) {
  const { selectRow, property, options } = rest;
  const cententProps = { property, options };
  const checkBoxStyle = { marginLeft: 5 };

  const detailCheckBox = useMemo(() => {
    return (
      index <= 0 &&
      selectRow && (
        <Checkbox
          key={detail.id}
          injectContext={"SelectContext"}
          id={detail.id}
          detail={detail}
          style={checkBoxStyle}
          {...rest}
        />
      )
    );
  }, []);

  const cell = useMemo(() => {
    return (
      <CustomCell style={style} align={align} left={detailCheckBox}>
        <CustomCellContent {...rest} detail={detail} {...cententProps} />
      </CustomCell>
    );
  }, []);

  return cell;
}

function DetailRow({ index, detail, ...rest }) {
  const { selectRow, columns } = rest;
  const hide = selectRow && selectRow.hide;

  const detailHeadCell = useMemo(() => {
    return selectRow && !hide && <CustomCell left={false} />;
  }, []);

  const detailCellList = useMemo(() => {
    return columns.map(({ align, style, ...column }, i) => {
      return (
        <DetailCell
          key={i}
          index={i}
          align={align}
          style={style}
          detail={detail}
          {...column}
          {...rest}
        />
      );
    });
  }, []);

  const row = useMemo(() => {
    return (
      <CustomRow key={index} detail={detail} {...rest}>
        {detailHeadCell}
        {detailCellList}
      </CustomRow>
    );
  }, [detailHeadCell, detailCellList, index, detail]);
  return row;
}

function DetailRowList(props) {
  const { d, parentEl } = props;
  const [page, setPage] = useState(0);
  const [details, setDetails] = useState([]);

  function updateDetails() {
    setDetails(
      details.concat(
        d.details.slice(
          page * ROWS_PER_PAGE,
          page * ROWS_PER_PAGE + ROWS_PER_PAGE
        )
      )
    );
  }

  useEffect(() => {
    // 초기 랜더링
    if (d.details.length > 0) {
      updateDetails();
      setPage(page + 1);
    }
  }, []);

  const [scrollTop, el] = useScroll(parentEl);
  const maxPage = Math.ceil(d.details.length / ROWS_PER_PAGE);
  const detailEls = document.getElementsByClassName(`${d.id}-detail`);

  useEffect(() => {
    if (detailEls.length > 0) {
      if (
        Array.from(detailEls)
          .pop()
          .getBoundingClientRect().top < el.clientHeight
      ) {
        if (maxPage > page) {
          console.log("detail update");
          updateDetails();
          setPage(page + 1);
        }
      }
    }
  });

  const detailList = useMemo(() => {
    return details.map((detail, i) => (
      <DetailRow key={i} index={i} detail={detail} {...props} />
    ));
  }, [details]);

  return detailList;
}

function DefaultCell({
  index,
  detail,
  style,
  align,
  customExpandIconButton,
  ...rest
}) {
  const { property, options, d } = rest;
  const contentProps = { property, options };

  const hideAndShowButton = useMemo(() => {
    return index === 0 && customExpandIconButton;
  }, [customExpandIconButton]);

  const cell = useMemo(() => {
    // console.log("cell");
    return (
      <CustomCell
        align={align}
        style={style && style.body}
        right={hideAndShowButton}
        cellType={"body"}
        {...rest}
      >
        <CustomCellContent {...rest} {...contentProps} />
      </CustomCell>
    );
  }, [hideAndShowButton, d]);

  return cell;
}

function BodyRowContainer(props) {
  const [isShow, setShow] = useState(false);
  const { d, columns, selectRow, indexed, num } = props;
  const hide = selectRow && selectRow.hide;
  const isSelectRow = selectRow && Object.keys(selectRow).length > 0;
  const index = useRef(num + 1);

  const handleClickShowBtn = useCallback(
    e => {
      e.stopPropagation();
      setShow(!isShow);
    },
    [isShow]
  );

  const checkCell = useMemo(() => {
    //TODO: 디테일 있을 시 체크박스 체크 수정
    return (
      ((isSelectRow && !hide) || indexed) && (
        <CustomCell padding={"checkbox"} align="center" {...props}>
          {indexed ? (
            index.current
          ) : (
            <Checkbox
              checkType={"body"}
              injectContext={"SelectContext"}
              id={d.id}
              {...props}
            />
          )}
        </CustomCell>
      )
    );
  }, [d.id]);

  const customExpandIconButton = useMemo(
    () =>
      d.hasDetails && (
        <CustomExpandIconButton
          onClick={handleClickShowBtn}
          isExpand={isShow}
        />
      ),
    [d.hasDetails, handleClickShowBtn, isShow]
  );

  const cellList = useMemo(() => {
    return columns.map(({ align, style, ...column }, i) => {
      return (
        <DefaultCell
          key={i}
          index={i}
          align={align}
          style={style}
          customExpandIconButton={customExpandIconButton}
          {...column}
          {...props}
        />
      );
    });
  }, [columns, customExpandIconButton, props]);

  const defaultRow = useMemo(() => {
    return (
      <CustomRow rowType={"body"} {...props}>
        {checkCell}
        {cellList}
      </CustomRow>
    );
  }, [checkCell, cellList]);

  const detailRows = useMemo(() => {
    return d.hasDetails && isShow && <DetailRowList {...props} />;
  }, [isShow, d]);

  return (
    <>
      {defaultRow}
      {detailRows}
    </>
  );
}

export default React.memo(BodyRowContainer);
