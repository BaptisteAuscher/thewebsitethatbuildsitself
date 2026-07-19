import { useEffect, useMemo, useRef, useState } from "react";
import { useEvents } from "./hooks/useEvents";
import type { Component } from "./types";

function App() {
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleScroll,
    handleKeyPress,
    eventQueue,
  } = useEvents();
  const ref = useRef<HTMLDivElement>(null);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [_, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080/ws");
    ws.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "1236" },
        }),
      );
    };
    setSocket(ws);

    return () => ws.close();
  }, []);

  useEffect(() => {
    ref.current?.focus();
  }, []);
  const components: Component[] = useMemo(
    () => [
      {
        id: "1",
        node: <div style={{ backgroundColor: "white" }}>Hello World</div>,
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        node: <div style={{ backgroundColor: "red" }}>Hello World</div>,
        position: { x: 50, y: 150 },
      },
      {
        id: "3",
        node: <div style={{ backgroundColor: "white" }}>Hello World</div>,
        position: { x: 100, y: 300 },
      },
    ],
    [],
  );

  useEffect(() => {
    if (eventQueue.length === 0) return;
    sendMessage(eventQueue[eventQueue.length - 1]?.type);
  }, [eventQueue]);

  const sendMessage = (message: string) => {
    if (!socket) return;
    console.log(message);
    socket.send(
      JSON.stringify({
        message: message,
      }),
    );
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      style={{ width: "100vw", height: "100vh", backgroundColor: "var(--bg)" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleScroll}
      onKeyDown={handleKeyPress}
    >
      {components.map((component) => (
        <div
          key={component.id}
          className="magic-appear"
          style={{
            position: "absolute",
            left: component.position.x,
            top: component.position.y,
          }}
        >
          {component.node}
        </div>
      ))}
    </div>
  );
}

export default App;
