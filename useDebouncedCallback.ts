// useDebouncedCallback.ts
import { useEffect, useRef } from "react";
import debounce from "./debounce";

function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options?: { leading?: boolean },
  deps: any[] = []
): T & { cancel: () => void } {
  const latestFn = useRef(fn);
  const debouncedFn = useRef(debounce(fn, wait, options));

  useEffect(() => {
    latestFn.current = fn;
  }, [fn]);

  useEffect(() => {
    debouncedFn.current = debounce(latestFn.current, wait, options);
  }, [wait, options, ...deps]);

  useEffect(() => {
    return () => {
      debouncedFn.current.cancel();
    };
  }, []);

  return debouncedFn.current as any;
}

export default useDebouncedCallback;
