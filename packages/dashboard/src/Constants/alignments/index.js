import cn from 'classnames'

export const justLeft = cn("justify-content-start");
export const justCenter = cn("justify-content-center");
export const justRight = cn("justify-content-end");

export const alignLeft = cn("align-items-start");
export const alignCenter = cn("align-items-center");
export const alignRight = cn("align-items-end");

const flex = "d-flex";
const row = "flex-row";
export const leftLeft = cn(flex, row, justLeft, alignLeft);
export const leftCenter = cn(flex, row, justLeft, alignCenter);
export const rightRight = cn(flex, row, justRight, alignRight);
export const rightCenter = cn(flex, row, justRight, alignCenter);
export const allCenter = cn(flex, row, justCenter, alignCenter);

const col = "flex-column";
export const topLeft = cn(flex, col, leftLeft);
export const topRight = cn(flex, col, rightRight);
export const topCenter = cn(flex, col, justLeft, alignCenter);

export const bottomLeft = cn(flex, col, justLeft, alignLeft);
export const bottomRight = cn(flex, col, justRight, alignRight);
export const bottomCenter = cn(flex, col, justRight, alignCenter);
export const vCenter = cn(flex, col, justCenter, alignCenter);

export const noMargin = cn("m-0");
export const noPad = cn("p-0");
export const noMarginPad = cn(noMargin, noPad);

export const full = "w-100";
