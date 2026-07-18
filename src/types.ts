export type Position = {
  x: number;
  y: number;
};
export type Component = {
  id: string;
  node: React.ReactNode;
  position: Position;
};

export type UserEventType = "click" | "drag" | "scroll" | "keypress";
export type UserEvent<T extends UserEventType> = {
  type: T;
  target?: string; // id of the component
  payload?: T extends "click"
    ? {
        position: Position;
      }
    : T extends "drag"
      ? {
          startPosition: Position;
          delta: Position;
        }
      : T extends "scroll"
        ? {
            delta: number;
          }
        : T extends "keypress"
          ? {
              key: string;
            }
          : never;
};
