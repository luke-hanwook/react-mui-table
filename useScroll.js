import { useState, useEffect } from "react";

function useWindowScroll(parentEl) {
  let somethingEl = parentEl || document.documentElement;
  let eventEl = parentEl || window;

  const isNeedScrollTopOfDocumentElement =
    somethingEl.clientHeight > document.documentElement.clientHeight;

  somethingEl = isNeedScrollTopOfDocumentElement
    ? document.documentElement
    : somethingEl;

  eventEl = isNeedScrollTopOfDocumentElement ? window : somethingEl;

  const [scrollTop, setScrollTop] = useState(somethingEl.scrollTop);

  useEffect(() => {
    function handleScroll() {
      setScrollTop(somethingEl.scrollTop + 100);
    }

    eventEl.addEventListener("scroll", handleScroll);
    return () => {
      eventEl.removeEventListener("scroll", handleScroll);
    };
  }, [eventEl, somethingEl]);
  return [scrollTop, somethingEl];
}

export default useWindowScroll;
