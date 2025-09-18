import {useEffect } from "react";

export default function Tooltip({ content, children }) {
  useEffect(() => {
    Array.from(document.querySelectorAll("[data-tooltip]")).forEach((el) => {
      let tip = document.createElement("div");
      tip.classList.add("tooltip");
      tip.innerText = el.getAttribute("data-tooltip");
      tip.style.transform =
        "translate(" +
        (el.hasAttribute("tip-left") ? "calc(-100% - 5px)" : "15px") +
        ", " +
        (el.hasAttribute("tip-top") ? "-100%" : "0") +
        ")";
      el.appendChild(tip);
      el.onmousemove = (e) => {
        tip.style.left = e.clientX + "px";
        tip.style.top = e.clientY + "px";
      };
    });
  }, []);

  return <div data-tooltip={content}>{children}</div>;
}
