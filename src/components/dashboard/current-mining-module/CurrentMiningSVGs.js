import React from "react";

const Logo = ({
  style = {},
  fill = "white",
  width = "64px",
  className = "",
  viewBox = "0 0 64 64",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path fill={fill} d="M57.13,27.87a3.77,3.77,0,0,0-3.4-1.71H37.81l.35-.6a2.85,2.85,0,0,0-.06-2.8,3.57,3.57,0,0,0-3.16-1.56H16l-1.76,3H34.62a2.53,2.53,0,0,1,.85.08.33.33,0,0,1-.06.12l-2.23,3.77a2.06,2.06,0,0,1-1.74.88H13.76a5.36,5.36,0,0,0-4.23,2.63C9.37,32,8,34.26,6.86,36.13l-.42.69,3.12.06.13-.23.47-.83c.54-1,1.44-2.55,1.62-2.82a2.77,2.77,0,0,1,2-1H30.5c2.83,0,4-.42,5.59-2.89H53.55c.75,0,1,.19,1,.22a.27.27,0,0,1-.05.12L51.93,34a2.29,2.29,0,0,1-1.71,1H32A5.38,5.38,0,0,0,26.86,38c-.06.1-.23.42-.45.84-.5.94-1.26,2.35-1.74,3.2l-.38.68,3.38.06.14-.23.74-1.35c.51-.94,1.15-2.11,1.29-2.35A2.78,2.78,0,0,1,31.75,38H49c2.6,0,4.1-.41,5.63-2.72l2.56-4.38A3,3,0,0,0,57.13,27.87Z"/>
    <path fill={fill} d="M32,0A32,32,0,1,0,64,32,32,32,0,0,0,32,0Zm0,61.14A29.14,29.14,0,1,1,61.14,32,29.17,29.17,0,0,1,32,61.14Z"/>
  </svg>
);



const Circle = ({
    style = {},
    fill = "white",
    width = "323.535",
    className = "",
    viewBox="0 0 323.535 323.535",
  }) => (
    <svg
      width={width}
      style={style}
      height={width}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <circle id="Ellipse_5" data-name="Ellipse 5" cx="161.268" cy="161.268" r="161.268" transform="translate(0.5 0.5)" fill="none" stroke={fill} strokeMiterlimit="10" strokeWidth="1" opacity="0.3"/>
    </svg>
  );


export default { Logo, Circle };
