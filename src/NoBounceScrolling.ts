import { IOptions } from "./IOptions";
import { DEFAULT_FLING_DELAY, DEFAULT_RESISTANCE, EVENT_TOUCHEND, EVENT_TOUCHMOVE, EVENT_TOUCHSTART, EVENT_TYPES } from "./constants";
/**
 * No bounce scrolling for mobile ios
 */

class NoBounceScrolling {
  /**
   * scrolling dom
   */
  private element: HTMLElement;

  
  /**
   * scrolling options
   */
  private options: IOptions;
  
  /**
   * touch x
   */
  private touchX: number = 0;
  /**
   * touch y
   */
  private touchY: number = 0;
  /**
   * touch times
   */
  private positions: { x: number; y: number; time: number }[] = [];
  /**
   * resistance speed x
   */
  private speedX: number = 0;
  /**
   * resistance speed y
   */
  private speedY: number = 0;

  private eventMethodMap: { [key: string]: any }

  private constructor(element: HTMLElement, options?: IOptions) {
    this.element = element;
    this.options = {
      onScrollX: options?.onScrollX || (() => {}),
      onScrollY: options?.onScrollY || (() => {}),
      resistance: options?.resistance,
      flingDelay: options?.flingDelay,
    };
    this.eventMethodMap = {
      [EVENT_TOUCHSTART]: this.onTouchStart.bind(this),
      [EVENT_TOUCHMOVE]: this.onTouchMove.bind(this),
      [EVENT_TOUCHEND]: this.onTouchEnd.bind(this),
    }
  }

  static create(element: HTMLElement, options?: IOptions) {
    if (!element) throw new Error('element can not be null')
    return new NoBounceScrolling(element, options);
  }

  onTouchStart(event: TouchEvent) {
    const { clientX, clientY } = this.getClientXY(event);
    this.touchX = clientX;
    this.touchY = clientY;
    this.positions = [];
    this.positions.push({
      x: clientX,
      y: clientY,
      time: Date.now(),
    });
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    requestAnimationFrame(() => {
      const { clientX, clientY } = this.getClientXY(event);
      const offsetX = clientX - this.touchX;
      const offsetY = clientY - this.touchY;
      if (Math.abs(offsetY) >= Math.abs(offsetX)) {
        const scrollTop = this.element.scrollTop - offsetY;
        this.element.scrollTop = scrollTop;
        this.options.onScrollY?.(scrollTop);
      } else {
        const scrollLeft = this.element.scrollLeft - offsetX;
        this.element.scrollLeft = scrollLeft;
        this.options.onScrollX?.(scrollLeft);
      }
      this.touchX = clientX;
      this.touchY = clientY;
      this.positions.push({
        x: clientX,
        y: clientY,
        time: new Date().valueOf(),
      });
      if (this.positions.length > 100) {
        this.positions.shift();
      }
    });
  }

  onTouchEnd(event: TouchEvent) {
    const { clientX, clientY } = this.getClientXY(event);

    this.touchX = clientX;
    this.touchY = clientY;

    this.positions.push({
      x: clientX,
      y: clientY,
      time: new Date().valueOf(),
    });
    const endPosition = this.positions[this.positions.length - 1];
    const startPosition = this.positions[0];
    const scrollTime = endPosition.time - startPosition.time;
    const flingDelay = this.options.flingDelay || DEFAULT_FLING_DELAY;
    if (scrollTime < flingDelay) {
      const timeDiff = scrollTime / 1000;
      this.speedX = (endPosition.x - startPosition.x) / timeDiff;
      this.speedY = (endPosition.y - startPosition.y) / timeDiff;
      const computeScroll = () => {
        const resistance = this.options.resistance || DEFAULT_RESISTANCE;
        this.speedX = this.speedX * resistance;
        this.speedY = this.speedY * resistance;

        if (Math.abs(this.speedY) >= Math.abs(this.speedX)) {
          const scrollTop = this.element.scrollTop - this.speedY;
          this.element.scrollTop = scrollTop;
          this.options?.onScrollY?.(scrollTop);
        } else {
          const scrollLeft = this.element.scrollLeft - this.speedX;
          this.element.scrollLeft = scrollLeft;
          this.options?.onScrollX?.(scrollLeft);
        }

        if (Math.abs(this.speedX) < 1) this.speedX = 0;
        if (Math.abs(this.speedY) < 1) this.speedY = 0;
        if (!(this.speedX === 0 && this.speedY === 0)) {
          requestAnimationFrame(computeScroll);
        }
      };
      requestAnimationFrame(computeScroll);
    }
  }

  getClientXY(event: TouchEvent) {
    const clientX = event?.changedTouches && Number(event?.changedTouches[0]?.clientX?.toFixed(6));
    const clientY = event?.changedTouches && Number(event?.changedTouches[0]?.clientY?.toFixed(6));
    return { clientX, clientY };
  }

  startScroll() {
    EVENT_TYPES.forEach(type => {
      this.element.addEventListener(type, this.eventMethodMap[type], true);
    })
  }

  destroy() {
    EVENT_TYPES.forEach(type => {
      this.element.removeEventListener(type, this.eventMethodMap[type], true);
    })
  }
}

export { NoBounceScrolling };
