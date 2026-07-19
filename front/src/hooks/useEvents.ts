import { useEffect, useRef, useState } from "react";
import type { Position, UserEvent, UserEventType } from "../types";

const CLICK_DISTANCE_THRESHOLD = 10;
const DRAG_SAMPLE_INTERVAL_MS = 1000;
const SCROLL_IDLE_FLUSH_MS = 100;
const SCROLL_MAX_SEGMENT_MS = 500;

type DragState = {
  startPosition: Position;
  segmentStartPosition: Position;
  segmentStartedAt: number;
  lastPosition: Position;
  hasDragged: boolean;
};

type ScrollState = {
  delta: number;
  segmentStartedAt: number;
  timeoutId: ReturnType<typeof window.setTimeout>;
};

const getDistance = (start: Position, end: Position) =>
  Math.hypot(end.x - start.x, end.y - start.y);

export function useEvents() {
  const [eventQueue, setEventQueue] = useState<UserEvent<UserEventType>[]>([]);
  const dragRef = useRef<DragState | undefined>(undefined);
  const scrollRef = useRef<ScrollState | undefined>(undefined);

  const appendEvent = (userEvent: UserEvent<UserEventType>) => {
    setEventQueue((currentEventQueue) => [...currentEventQueue, userEvent]);
  };

  const flushScroll = () => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    window.clearTimeout(scroll.timeoutId);
    scrollRef.current = undefined;

    if (scroll.delta !== 0) {
      appendEvent({ type: "scroll", payload: { delta: scroll.delta } });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const position = { x: event.clientX, y: event.clientY };
    dragRef.current = {
      startPosition: position,
      segmentStartPosition: position,
      segmentStartedAt: event.timeStamp,
      lastPosition: position,
      hasDragged: false,
    };
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const position = { x: event.clientX, y: event.clientY };
    drag.lastPosition = position;
    dragRef.current = undefined;

    if (!drag.hasDragged && getDistance(drag.startPosition, position) <= CLICK_DISTANCE_THRESHOLD) {
      appendEvent({ type: "click", payload: { position: drag.startPosition } });
      return;
    }

    const delta = {
      x: position.x - drag.segmentStartPosition.x,
      y: position.y - drag.segmentStartPosition.y,
    };

    if (delta.x !== 0 || delta.y !== 0) {
      appendEvent({
        type: "drag",
        payload: { startPosition: drag.segmentStartPosition, delta },
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const position = { x: event.clientX, y: event.clientY };
    drag.lastPosition = position;

    if (getDistance(drag.startPosition, position) <= CLICK_DISTANCE_THRESHOLD) return;

    drag.hasDragged = true;

    if (event.timeStamp - drag.segmentStartedAt < DRAG_SAMPLE_INTERVAL_MS) return;

    const delta: Position = {
      x: position.x - drag.segmentStartPosition.x,
      y: position.y - drag.segmentStartPosition.y,
    };

    appendEvent({
      type: "drag",
      payload: { startPosition: drag.segmentStartPosition, delta },
    });

    drag.segmentStartPosition = position;
    drag.segmentStartedAt = event.timeStamp;
  };

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    const currentScroll = scrollRef.current;

    if (!currentScroll) {
      scrollRef.current = {
        delta: event.deltaY,
        segmentStartedAt: event.timeStamp,
        timeoutId: window.setTimeout(flushScroll, SCROLL_IDLE_FLUSH_MS),
      };
      return;
    }

    currentScroll.delta += event.deltaY;
    window.clearTimeout(currentScroll.timeoutId);

    if (event.timeStamp - currentScroll.segmentStartedAt >= SCROLL_MAX_SEGMENT_MS) {
      flushScroll();
      return;
    }

    currentScroll.timeoutId = window.setTimeout(flushScroll, SCROLL_IDLE_FLUSH_MS);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    appendEvent({ type: "keypress", payload: { key: event.key } });
  };

  useEffect(() => {
    console.log(eventQueue);
  }, [eventQueue]);

  useEffect(() => {
    return () => {
      if (scrollRef.current) window.clearTimeout(scrollRef.current.timeoutId);
    };
  }, []);

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleScroll,
    handleKeyPress,
    eventQueue,
  };
}
