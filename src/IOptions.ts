interface IOptions {
  onScrollX?: (x: number) => void;
  onScrollY?: (y: number) => void;
  resistance?: number;
  flingDelay?: number;
}

export { IOptions }