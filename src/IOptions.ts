interface IOptions {
  /** scrolling x */
  onScrollX?: (x: number) => void;
  /** scrolling y */
  onScrollY?: (y: number) => void;
  resistance?: number;
  flingDelay?: number;
}

export { IOptions }