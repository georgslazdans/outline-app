"use client";

import { useEffect, useRef } from "react";

const useDebounced = (
  changeHandler: (value: any) => void,
  timer: number = 500
) => {
  const handler = useRef<NodeJS.Timeout>();
  const pendingEvent = useRef<any>(null);

  useEffect(() => {
    handler.current = setTimeout(() => {
      if (pendingEvent.current) {
        changeHandler(pendingEvent.current);
        pendingEvent.current = null;
      }
    }, timer);

    return () => {
      clearTimeout(handler.current);
    };
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
    },
    flush: flush,
  };
};

export default useDebounced;
