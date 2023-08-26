import type { Component, JSX } from "solid-js";

const RickyButton: Component<{
  bg_color: JSX.CSSProperties["color"];
  font_size?: JSX.CSSProperties["font-size"];
  margin_top?: JSX.CSSProperties["margin-top"];
  margin_left?: JSX.CSSProperties["margin-left"];
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  on_click?: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>["onClick"];
  children: string | JSX.Element;
}>
  = ({ bg_color, font_size = "16px", type = "button", on_click, margin_top = "0px", margin_left = "0px", children }) => {
    return (
      <button
        onClick={on_click}
        type={type}
        style={{
          "border": "2px solid black",
          "border-radius": "6px",
          "background-color": `${bg_color}`,
          "font-size": `${font_size}`,
          "margin-top": `${margin_top}`,
          "margin-left": `${margin_left}`,
          "color": "black"
        }}>
        {children}
      </button>
    )
  }

export default RickyButton;
