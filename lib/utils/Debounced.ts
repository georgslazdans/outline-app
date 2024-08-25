"use client";

import { useEffect, useRef, useState } from "react";

const useDebounced = (
  changeHandler: (value: any) => void,
  timer: number = 500
) => {
  const handler = useRef<NodeJS.Timeout>();
  const [pendingEvent, setPendingEvent] = useState<any>();

  useEffect(() => {
    handler.current = setTimeout(() => {
      if (pendingEvent) {
        changeHandler(pendingEvent);
        setPendingEvent(undefined);
      }
    }, timer);

    return () => {
      clearTimeout(handler.current);
    };
  }, [changeHandler, pendingEvent, timer]);

  const flush = () => {
    if (handler.current) {
      clearTimeout(handler.current);
    }
    if (pendingEvent) {
      changeHandler(pendingEvent);
      setPendingEvent(undefined);
    }
  };
  return {
    onChange: setPendingEvent,
    flush: flush,
  };
};

export default useDebounced;
