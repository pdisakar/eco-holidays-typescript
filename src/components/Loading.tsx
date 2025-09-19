"use client"
import * as React from "react";

interface LoadingProps {
  title?: string;
  titleId?: string;
  [x: string]: any; 
}


const Loading = ({ title, titleId, ...props }: LoadingProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    fill="currentColor"
    {...props}>
    {title ? <title id={titleId}>{title}</title> : null}
    <circle
      transform="translate(8)"
      cy={16}
      r={0}>
      <animate
        attributeName="r"
        values="0; 4; 0; 0"
        dur="1.2s"
        repeatCount="indefinite"
        begin={0}
        keyTimes="0;0.2;0.7;1"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
        calcMode="spline"
      />
    </circle>
    <circle
      transform="translate(16)"
      cy={16}
      r={0}>
      <animate
        attributeName="r"
        values="0; 4; 0; 0"
        dur="1.2s"
        repeatCount="indefinite"
        begin={0.3}
        keyTimes="0;0.2;0.7;1"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
        calcMode="spline"
      />
    </circle>
    <circle
      transform="translate(24)"
      cy={16}
      r={0}>
      <animate
        attributeName="r"
        values="0; 4; 0; 0"
        dur="1.2s"
        repeatCount="indefinite"
        begin={0.6}
        keyTimes="0;0.2;0.7;1"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
        calcMode="spline"
      />
    </circle>
  </svg>
);
export default Loading;
