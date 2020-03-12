import { useContext } from "react";
import Context from "./context";

function useCustomContext(field) {
  const context = useContext(Context[field].Context);

  return (
    context || {
      state: null,
      actions: null
    }
  );
}

export default useCustomContext;
