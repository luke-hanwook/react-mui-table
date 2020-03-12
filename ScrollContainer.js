import { useEffect } from "react";
import useScroll from "./useScroll";
import useCustomContext from "./useCustomContext";

function ScrollContainer({ parentEl, rowCount, children, loading }) {
  const {
    state: { page, rowsPerPage },
    actions: { onChangePage }
  } = useCustomContext("PaginationContext");

  const [scrollTop, el] = useScroll(parentEl);
  const isBottomOfWindow = scrollTop + el.clientHeight >= el.scrollHeight;
  const maxPage = Math.ceil(rowCount / rowsPerPage);

  useEffect(() => {
    if (isBottomOfWindow) {
      if (maxPage > page) {
        // console.log("update", page);
        onChangePage(null, page + 1);
      }
    }
  });

  return children;
}

export default ScrollContainer;
