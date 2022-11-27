import { useCallback, useRef } from "react";

export default function useDebounce(callback: Function, delay: number) {
  const timer = useRef(0);

  const debouncedCb = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(callback, delay);
  }, [callback, delay]);

  return debouncedCb;
}
