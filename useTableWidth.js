import { useState, useEffect } from "react";

function useTableWidth(id) {
  const [tableCellWidth, setTableCellWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setTableCellWidth(document.getElementById(id).offsetWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id, tableCellWidth]);

  return tableCellWidth;
}

export default useTableWidth;
