import { useEffect, useMemo, useRef } from "react";
import { useEvents } from "./hooks/useEvents";
import type { Component } from "./types";

function App() {
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleScroll,
    handleKeyPress,
  } = useEvents();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);
  const components: Component[] = useMemo(
    () => [
      {
        id: "1",
        node: <div style={{ backgroundColor: 'white' }}>Hello World</div>,
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
