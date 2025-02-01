"use client";

import { useCallback, useRef } from "react";

const useDebounced = (
  changeHandler: (value: any) => void,
  timer: number = 500
) => {
  const handler = useRef<NodeJS.Timeout>();
  const pendingEvent = useRef<any>(null);

  const cancelCurrent = () => {
    if (handler.current) {
      clearTimeout(handler.current);
      handler.current = undefined;
    }
  };

  const createHandler = useCallback(() => {
    cancelCurrent();
    handler.current = setTimeout(() => {
      changeHandler(pendingEvent.current);
      pendingEvent.current = null;
    }, timer);
  }, [changeHandler, timer]);

  const flush = () => {
    if (handler.current) {
      clearTimeout(handler.current);
    }
    if (pendingEvent.current) {
      changeHandler(pendingEvent.current);
      pendingEvent.current = null;
    }
  };

  return {
    onChange: (event: any) => {
      pendingEvent.current = event;
      createHandler();
    },
    flush: flush,
    cancel: cancelCurrent,
  };
};

export default useDebounced;
