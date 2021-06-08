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
        <circle id="Ellipse_5" data-name="Ellipse 5" cx="161.268" cy="161.268" r="161.268" transform="translate(0.5 0.5)" fill="none" stroke={fill} strokeMiterlimit="10" strokeWidth="1"/>

    </svg>
  );



  const CurrentMiner_first_EMPTY = ({
    style = {},
    fill = "#D9D9D9",
    width = "96.914",
    height="113.287",
    className = "",
    viewBox="0 0 96.914 113.287",
    loading=false
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      loading={loading ? 1 : 0}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_118" data-name="Group 118" transform="translate(-284.205 -270.278)">
      <line id="Line_7" className={loading ? "minericon_line_loading" : "minericon_line"} data-name="Line 7" x1="53.956" y1="71.872" transform="translate(326.763 311.394)" />
      <path id="Path_28"  data-name="Path 28" d="M322.368,290.829l.912-.912c3.1,3.265,5.079,5.779,5.079,5.779a22.2,22.2,0,0,0-5.248-8.232l.755-.754-1.061-1.061-.759.759a23.685,23.685,0,0,0-8.227-5.251s2.514,1.979,5.779,5.078l-.911.912,1.31,1.31-6.161,6.161-5.011-5.011,1.253-1.253a1.24,1.24,0,0,0-.052-1.665l-3.073-3.072c-1.247-1.247-4.5-.24-4.99.252s-1.5,3.742-.252,4.989l3.073,3.073a1.24,1.24,0,0,0,1.665.052l1.315-1.315,5.011,5.011-7.54,7.54,1.061,1.061,7.54-7.54,7.032,7.032-1.123,1.123.717.718,3.308-3.308-.718-.717-1.123,1.123-7.032-7.032,6.161-6.161Z" fill={loading ? "#555555" :fill}/>
      {loading ?
      <path id="Path_85" className="minericon_loader" data-name="Path 85" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11272.175 -3421.662)"/>
      : null }
      <path id="Path_85" className="minericon_box" opacity={loading ? "0.5" : "1"} data-name="Path 85" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11272.175 -3421.662)"/>
    </g>
    </svg>
  );

  const CurrentMiner_first_FULL = ({
    style = {},
    width = "96.994",
    height="113.232",
    className = "",
    viewBox="0 0 96.994 113.232",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
  <g id="Group_117" data-name="Group 117" transform="translate(-284.125 -270.334)">
    <path id="Path_41" data-name="Path 41" d="M342.23,292.624l-9.466-18.412a7.844,7.844,0,0,0-6.366-3.878h-.025l-26.239.129a7.79,7.79,0,0,0-6.335,3.953l-9.128,18.42a6.217,6.217,0,0,0,1.339,6.982l24.13,21.668a5.141,5.141,0,0,0,6.74-.019L340.966,299.6A6.15,6.15,0,0,0,342.23,292.624Zm-1.987,6.18-24.086,21.868a4.044,4.044,0,0,1-5.3.014l-24.13-21.668a5.154,5.154,0,0,1-1.094-5.705l9.128-18.42a6.717,6.717,0,0,1,5.377-3.355l26.24-.129h.02a6.766,6.766,0,0,1,5.409,3.3l9.466,18.412A5.085,5.085,0,0,1,340.243,298.8Z" fill="#71eb9a"/>
    <g id="Group_23" data-name="Group 23">
      <path id="Path_42" data-name="Path 42" d="M311.072,302.155l-7.375-7.376a1.4,1.4,0,1,1,1.975-1.976l5.4,5.4,10.19-10.19a1.4,1.4,0,0,1,1.976,1.976Z" fill="#71eb9a"/>
    </g>
    <line className="fullicon_line" id="Line_17" data-name="Line 17" x1="53.956" y1="71.872" transform="translate(326.763 311.394)"/>
  </g>

    </svg>
  );



  const CurrentMiner_second_EMPTY = ({
    style = {},
    fill = "#D9D9D9",
    width = "142.722",
    height="70.994",
    className = "",
    loading=false,
    viewBox="0 0 142.722 70.994",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      loading={loading ? 1 : 0}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_119" data-name="Group 119" transform="translate(-185.903 -567.045)">
      <line id="Line_6" className={loading ? "minericon_line_loading" : "minericon_line"} data-name="Line 6" x1="89.943" y2="30.822" transform="translate(238.521 567.518)"/>
      <path id="Path_20" data-name="Path 20" d="M224.068,606.289l.911-.911c3.1,3.265,5.079,5.778,5.079,5.778a22.176,22.176,0,0,0-5.247-8.231l.754-.754-1.06-1.061-.759.759a23.708,23.708,0,0,0-8.227-5.252s2.514,1.98,5.779,5.079l-.912.912,1.311,1.31-6.161,6.161-5.011-5.011,1.252-1.253a1.238,1.238,0,0,0-.052-1.665l-3.072-3.072c-1.248-1.248-4.5-.24-4.99.252s-1.5,3.742-.252,4.989l3.073,3.073a1.24,1.24,0,0,0,1.665.052l1.315-1.315,5.011,5.011-7.54,7.54,1.06,1.061,7.541-7.54,7.032,7.032-1.124,1.123.718.717,3.307-3.307-.717-.717-1.124,1.123L216.6,611.14l6.16-6.161Z" fill={loading ? "#555555" : "#D9D9D9"}/>
      {loading ?
      <path id="Path_86" className="minericon_loader" data-name="Path 86" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11370.477 -3106.042)"/>
      : null }
      <path id="Path_86" className="minericon_box" opacity={loading ? "0.5" : "1"} data-name="Path 86" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11370.477 -3106.042)"/>
    </g>
    </svg>
  );

  const CurrentMiner_second_FULL = ({
    style = {},
    width = "143.801",
    height="71.159",
    className = "",
    viewBox="0 0 143.801 71.159",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || "fullicon_second_extramargin"}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_120" data-name="Group 120" transform="translate(-184.824 -567.045)">
      <g id="Group_24" data-name="Group 24">
        <path id="Path_43" data-name="Path 43" d="M242.93,608.093l-9.467-18.412A7.842,7.842,0,0,0,227.1,585.8h-.025l-26.24.129a7.79,7.79,0,0,0-6.334,3.952L185.37,608.3a6.214,6.214,0,0,0,1.34,6.981l24.129,21.669a5.143,5.143,0,0,0,6.741-.019l24.085-21.867A6.151,6.151,0,0,0,242.93,608.093Zm-1.988,6.18L216.857,636.14a4.043,4.043,0,0,1-5.3.015l-24.13-21.669a5.149,5.149,0,0,1-1.094-5.7l9.128-18.42a6.711,6.711,0,0,1,5.377-3.355l26.239-.129h.02a6.764,6.764,0,0,1,5.409,3.295l9.467,18.411A5.088,5.088,0,0,1,240.942,614.273Z" fill="#71eb9a"/>
        <path id="Path_44" data-name="Path 44" d="M221.962,603.482l-10.19,10.19-5.4-5.4a1.4,1.4,0,0,0-1.976,1.976l7.376,7.375,12.165-12.166a1.4,1.4,0,0,0-1.975-1.975Z" fill="#71eb9a"/>
      </g>
      <line className="fullicon_line" id="Line_16" data-name="Line 16" x1="89.943" y2="30.822" transform="translate(238.521 567.518)"/>
    </g>

    </svg>
  );




  const CurrentMiner_third_EMPTY = ({
    style = {},
    fill = "#D9D9D9",
    width = "58.803",
    height="151.006",
    className = "",
    loading=false,
    viewBox="0 0 58.803 151.006",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      loading={loading ? 1 : 0}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_121" data-name="Group 121" transform="translate(-454.903 -672.033)">
      <line id="Line_5" className={loading ? "minericon_line_loading" : "minericon_line"} data-name="Line 5" x2="1.583" y2="98.812" transform="translate(482.627 672.041)"/>
      <g id="Group_16" data-name="Group 16">
        <path id="Path_26" data-name="Path 26" d="M493.111,791.339l.911-.912c3.1,3.266,5.079,5.779,5.079,5.779a22.177,22.177,0,0,0-5.247-8.231l.754-.754-1.061-1.061-.759.759a23.7,23.7,0,0,0-8.226-5.252s2.513,1.979,5.779,5.079l-.912.911,1.31,1.311-6.161,6.161-5.011-5.011,1.253-1.253a1.24,1.24,0,0,0-.052-1.665l-3.073-3.073c-1.247-1.247-4.5-.239-4.989.252s-1.5,3.743-.252,4.99l3.072,3.072a1.239,1.239,0,0,0,1.665.053l1.316-1.315,5.011,5.011-7.541,7.54,1.061,1.061,7.54-7.541,7.032,7.032-1.123,1.124.718.717,3.307-3.307-.718-.718-1.123,1.124-7.032-7.032,6.161-6.161Z" fill={loading ? "#555555" : "#D9D9D9"}/>
        {loading ?
        <path id="Path_87" className="minericon_loader" data-name="Path 87" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11101.477 -2921.042)" />
        : null }
        <path id="Path_87" opacity={loading ? "0.5" : "1"} className="minericon_box" data-name="Path 87" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-11101.477 -2921.042)" />
      </g>
    </g>
    </svg>
  );

  const CurrentMiner_third_FULL = ({
    style = {},
    width = "58.684",
    height="150.94",
    className = "",
    viewBox="0 0 58.684 150.94",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_122" data-name="Group 122" transform="translate(-454.135 -672.033)">
      <path id="Path_49" data-name="Path 49" d="M512.241,792.862l-9.467-18.412a7.844,7.844,0,0,0-6.366-3.878h-.024l-26.24.128a7.793,7.793,0,0,0-6.335,3.953l-9.128,18.421a6.215,6.215,0,0,0,1.339,6.981l24.13,21.669a5.141,5.141,0,0,0,6.74-.019l24.086-21.867A6.151,6.151,0,0,0,512.241,792.862Zm-1.988,6.18-24.086,21.867a4.043,4.043,0,0,1-5.3.015l-24.13-21.669a5.153,5.153,0,0,1-1.094-5.7l9.129-18.421a6.712,6.712,0,0,1,5.376-3.354l26.24-.129h.02a6.765,6.765,0,0,1,5.409,3.294l9.467,18.412A5.088,5.088,0,0,1,510.253,799.042Z" fill="#71eb9a"/>
      <path id="Path_50" data-name="Path 50" d="M491.272,788.25l-10.19,10.19-5.4-5.4a1.4,1.4,0,0,0-1.975,1.975l7.375,7.376,12.166-12.166a1.4,1.4,0,0,0-1.976-1.976Z" fill="#71eb9a"/>
      <line className="fullicon_line" id="Line_15" data-name="Line 15" x2="1.583" y2="98.812" transform="translate(482.627 672.041)"/>
    </g>
    </svg>
  );






  const CurrentMiner_fourth_EMPTY = ({
    style = {},
    fill = "#D9D9D9",
    width = "144.799",
    height="71.494",
    className = "",
    loading=false,
    viewBox="0 0 144.799 71.494",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      loading={loading ? 1 : 0}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Group_127" data-name="Group 127" transform="translate(-630.489 -566.544)">
        <line id="Line_8" className={loading ? "minericon_line_loading" : "minericon_line"} data-name="Line 8" x2="91.402" y2="31.322" transform="translate(630.651 567.017)"/>
        <path id="Path_22" data-name="Path 22" d="M755.077,606.289l.912-.911c3.1,3.265,5.078,5.778,5.078,5.778a22.176,22.176,0,0,0-5.247-8.231l.755-.754-1.061-1.061-.759.759a23.7,23.7,0,0,0-8.227-5.252s2.514,1.98,5.779,5.079l-.912.912,1.311,1.31-6.161,6.161-5.011-5.011,1.253-1.253a1.239,1.239,0,0,0-.053-1.665l-3.072-3.072c-1.247-1.248-4.5-.24-4.99.252s-1.5,3.742-.252,4.989l3.073,3.073a1.24,1.24,0,0,0,1.665.052l1.315-1.315,5.011,5.011-7.54,7.54,1.061,1.061,7.54-7.54,7.032,7.032-1.123,1.123.717.717,3.307-3.307-.717-.717-1.123,1.123-7.032-7.032,6.161-6.161Z" fill={loading ? "#555555" : "#D9D9D9"}/>
        {loading ?
        <path id="Path_88" className="minericon_loader" data-name="Path 88" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-10839.895 -3106.042)" fill="none" stroke="#D9D9D9" strokeWidth="1"/>
        : null }
        <path id="Path_88" opacity={loading ? "0.5" : "1"} className="minericon_box" data-name="Path 88" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-10839.895 -3106.042)" fill="none" stroke="#D9D9D9" strokeWidth="1"/>
      </g>
    </svg>
  );

  const CurrentMiner_fourth_FULL = ({
    style = {},
    width = "145.297",
    height="71.659",
    className = "",
    viewBox="0 0 145.297 71.659",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || "fullicon_fourth_extramargin"}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <g id="Group_124" transform="translate(-608.665 -534.027)">
      <g id="Group_123" transform="translate(-21.824 -32.517)">
        <path id="Path_45" d="M775.207,608.093l-9.467-18.412a7.842,7.842,0,0,0-6.365-3.878h-.025l-26.24.129a7.79,7.79,0,0,0-6.334,3.952L717.648,608.3a6.213,6.213,0,0,0,1.339,6.981l24.13,21.669a5.141,5.141,0,0,0,6.74-.019l24.085-21.867A6.149,6.149,0,0,0,775.207,608.093Zm-1.988,6.18L749.134,636.14a4.043,4.043,0,0,1-5.3.015l-24.13-21.669a5.149,5.149,0,0,1-1.094-5.7l9.128-18.42a6.711,6.711,0,0,1,5.377-3.355l26.239-.129h.02a6.764,6.764,0,0,1,5.409,3.295l9.467,18.411A5.086,5.086,0,0,1,773.219,614.273Z" fill="#71eb9a"/>
        <path id="Path_46" d="M754.239,603.482l-10.19,10.19-5.4-5.4a1.4,1.4,0,0,0-1.976,1.976l7.376,7.375,12.166-12.166a1.4,1.4,0,0,0-1.976-1.975Z" fill="#71eb9a"/>
      </g>
      <line className="fullicon_line" id="Line_51" data-name="Line 51" x2="91.402" y2="31.322" transform="translate(608.827 534.5)"/>
    </g>

    </svg>
  );





  const CurrentMiner_fifth_EMPTY = ({
    style = {},
    fill = "#D9D9D9",
    width = "97.435",
    height="113.941",
    className = "",
    loading = false,
    viewBox="0 0 97.435 113.941",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      loading={loading ? 1 : 0}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Group_129" data-name="Group 129" transform="translate(-558.022 -237.096)">
        <line id="Line_53" className={loading ? "minericon_line_loading" : "minericon_line"} data-name="Line 53" y1="72.681" x2="54.564" transform="translate(558.422 278.056)"/>
        <path id="Path_24" data-name="Path 24" d="M655.643,290.825l.912-.912c3.1,3.265,5.079,5.779,5.079,5.779a22.2,22.2,0,0,0-5.247-8.232l.754-.754-1.061-1.061-.759.759a23.687,23.687,0,0,0-8.226-5.251s2.513,1.979,5.778,5.078l-.911.912,1.31,1.31-6.161,6.161L642.1,289.6l1.253-1.253a1.24,1.24,0,0,0-.052-1.665l-3.073-3.072c-1.247-1.247-4.5-.24-4.989.252s-1.5,3.742-.252,4.989l3.072,3.073a1.24,1.24,0,0,0,1.665.052c.247-.246.868-.868,1.315-1.315l5.011,5.011-7.54,7.54,1.061,1.061,7.54-7.54,7.032,7.032-1.123,1.123.718.718,3.307-3.307-.718-.718-1.123,1.123-7.032-7.032,6.161-6.161Z" transform="translate(-20.825 -33.338)" fill={loading ? "#555555" :"#D9D9D9"}/>
        {loading ?
        <path id="Path_89" className="minericon_loader" data-name="Path 89" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-10959.726 -3454.844)"/>
        : null }
        <path id="Path_89" opacity={loading ? "0.5" : "1"} className="minericon_box" data-name="Path 89" d="M11584.37,3692.44h-10.951c-2.475,0-5.533.625-7.323,4.267s-6.84,14.065-8.006,16.345-2.367,4.74,0,7.264,21.558,19.58,23.858,21.56,4.507,2.647,7.282.192,22.112-20.052,23.973-21.752,1.659-4.566.277-7.014-7.8-15.1-8.594-16.594a7.608,7.608,0,0,0-6.8-4.267Z" transform="translate(-10959.726 -3454.844)"/>
      </g>
    </svg>
  );

  const CurrentMiner_fifth_FULL = ({
    style = {},
    width = "96.505",
    height="114.318",
    className = "",
    viewBox="0 0 96.505 114.318",
  }) => (
    <svg
      width={width}
      style={style}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Group_126" data-name="Group 126" transform="translate(-557.023 -237.54)">
        <g id="Group_125" data-name="Group 125" transform="translate(-21.824 -32.517)">
          <path id="Path_47" data-name="Path 47" d="M674.773,292.347l-9.466-18.412a7.844,7.844,0,0,0-6.366-3.878h-.025l-26.239.129a7.791,7.791,0,0,0-6.335,3.953l-9.128,18.42a6.217,6.217,0,0,0,1.339,6.982l24.13,21.668a5.143,5.143,0,0,0,6.74-.018l24.085-21.868A6.149,6.149,0,0,0,674.773,292.347Zm-1.987,6.18L648.7,320.395a4.044,4.044,0,0,1-5.3.014l-24.13-21.668a5.15,5.15,0,0,1-1.094-5.7l9.128-18.421a6.717,6.717,0,0,1,5.377-3.355l26.24-.129h.02a6.767,6.767,0,0,1,5.409,3.3l9.466,18.412A5.085,5.085,0,0,1,672.786,298.527Z" fill="#71eb9a"/>
          <path id="Path_48" data-name="Path 48" d="M653.8,287.736l-10.19,10.19-5.4-5.4a1.4,1.4,0,0,0-1.975,1.976l7.375,7.376,12.166-12.166a1.4,1.4,0,0,0-1.976-1.976Z" fill="#71eb9a"/>
        </g>
        <line className="fullicon_line" id="Line_52" data-name="Line 52" y1="72.681" x2="54.564" transform="translate(557.423 278.877)"/>
      </g>
    </svg>
  );




export default {
  Logo,
  Circle,
  CurrentMiner_first_EMPTY,
  CurrentMiner_first_FULL,
  CurrentMiner_second_EMPTY,
  CurrentMiner_second_FULL,
  CurrentMiner_third_EMPTY,
  CurrentMiner_third_FULL,
  CurrentMiner_fourth_EMPTY,
  CurrentMiner_fourth_FULL,
  CurrentMiner_fifth_EMPTY,
  CurrentMiner_fifth_FULL,
};
