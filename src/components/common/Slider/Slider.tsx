import React, { type ReactNode } from 'react';
import type { Props, State } from './Slider.types';

let pauseEvent = (e: Event) => {
  if (e?.stopPropagation) e.stopPropagation();
  if (e?.preventDefault) e.preventDefault();
  return false;
}

let stopPropagation = (e: Event): void => {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
}

function sanitizeInValue(x: number | number[]): number[] {
  return x === null ? [] : Array.isArray(x) ? x.slice() : [x];
}

function prepareOutValue(x: number[]): number | number[] {
  return x !== null && x.length === 1 ? x[0] : x.slice();
}

function trimSucceeding(length: number, nextValue: number[], minDistance: number, max: number) {
  for (let i: number = 0; i < length; i += 1) {
    let padding: number = max - i * minDistance;
    if (nextValue[length - 1 - i] > padding) {
      nextValue[length - 1 - i] = padding;
    }
  }
}

function trimPreceding(length: number, nextValue: number[], minDistance: number, min: number) {
  for (let i: number = 0; i < length; i += 1) {
    let padding: number = min + i * minDistance;
    if (nextValue[i] < padding) {
      nextValue[i] = padding;
    }
  }
}

function addListener(eventMap: Record<string, (e: any) => void>) {
  Object.keys(eventMap).forEach(key => {
    document.addEventListener(key, eventMap[key], false);
  });
}

function removeHandlers(eventMap: Record<string, (e: any) => void>) {
  Object.keys(eventMap).forEach(key => {
    document.removeEventListener(key, eventMap[key], false);
  });
}

function trimAlignValue(val: number, props: Props) {
  return alignValue(trimValue(val, props), props);
}

function alignValue(val: number, props: Props) {
  const valModStep: number = (val - props.min) % props.step;
  let alignedValue: number = val - valModStep;

  if (Math.abs(valModStep) * 2 >= props.step) {
    alignedValue += valModStep > 0 ? props.step : -props.step;
  }

  return parseFloat(alignedValue.toFixed(5));
}

function trimValue(val: number, props: Props) {
  let trimmed: number = val;
  if (trimmed <= props.min) {
    trimmed = props.min;
  }
  
  if (trimmed >= props.max) {
    trimmed = props.max;
  }
  
  return trimmed;
}

type ChangeEventName = 'onBeforeChange' | 'onChange' | 'onAfterChange';

class ReactSlider extends React.Component<Props, State> {
  
  public hasMoved: boolean = false;
  public isScrolling: boolean | undefined = false;
  public startPosition: number[] = [];
  public thumbRefs: (HTMLDivElement | null)[] = [];
  public slider: HTMLDivElement | null = null;
  public resizeElementRef: React.RefObject<HTMLDivElement | null>;
  public resizeObserver: ResizeObserver | null = null;
  public pendingResizeTimeouts: ReturnType<typeof setTimeout>[] = [];

  public static defaultProps: Partial<Props> = {
    min: 0,
    max: 100,
    step: 1,
    pageFn: step => step * 10,
    minDistance: 0,
    defaultValue: 0,
    orientation: 'horizontal',
    className: 'slider',
    thumbClassName: 'thumb',
    thumbActiveClassName: 'active',
    trackClassName: 'track',
    markClassName: 'mark',
    withTracks: true,
    pearling: false,
    disabled: false,
    snapDragDisabled: false,
    invert: false,
    marks: [],
    renderThumb: (props: any) => <div {...props} />,
    renderTrack: (props: any) => <div {...props} />,
    renderMark: (props: any) => <span {...props} />,
  };

  constructor(props: Props) {
    
    super(props);

    let value: number[] = sanitizeInValue(props.value);
    
    if (!value.length) {
      value = sanitizeInValue(props.defaultValue);
    }

    this.pendingResizeTimeouts = [];
    this.resizeElementRef = React.createRef();

    const zIndices = [];
    
    for (let i: number = 0; i < value.length; i += 1) {
      value[i] = trimAlignValue(value[i], props);
      zIndices.push(i);
    }

    this.state = {
      index: -1,
      upperBound: 0,
      sliderLength: 0,
      value,
      zIndices,
      pending: true,
      thumbSize: 0,
      startValue: 0,
      startPosition: 0,
    };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      if (this.resizeElementRef.current) {
        this.resizeObserver.observe(this.resizeElementRef.current);
      }
      this.resize();
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const value = sanitizeInValue(props.value);
    if (!value.length || state.pending) {
      return null;
    }
    return {
      value: value.map(item => trimAlignValue(item, props)),
    };
  }

  componentDidUpdate() {
    if (this.state.upperBound === 0) {
      this.resize();
    }
  }

  componentWillUnmount() {
    this.clearPendingResizeTimeouts();
    this.resizeObserver?.disconnect();
  }

  onKeyUp = () => {
    this.onEnd();
  };

  onMouseUp = () => {
    this.onEnd(this.getMouseEventMap());
  };

  onTouchEnd = (e: Event) => {
    e.preventDefault();
    this.onEnd(this.getTouchEventMap());
  };

  onBlur = () => {
    this.setState({ index: -1 }, () => this.onEnd(this.getKeyDownEventMap()));
  };

  onEnd(eventMap?: Record<string, (e: any) => void>) {
    if (eventMap) removeHandlers(eventMap);
    if (this.hasMoved) this.fireChangeEvent('onAfterChange');
    this.setState({ pending: false });
    this.hasMoved = false;
  }

  private onMouseMove = (e: MouseEvent) => {
    this.setState({ pending: true });
    const position: number[] = this.getMousePosition(e);
    const intervalBetween: number = this.getDiffPosition(position[0]);
    const newValue: number = this.getValueFromPosition(intervalBetween);
    this.move(newValue);
  };

  onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 1) return;
    
    this.setState({ pending: true });
    const position: number[] = this.getTouchPosition(e);

    if (typeof this.isScrolling === 'undefined') {
      const diffMainDir: number = position[0] - this.startPosition[0];
      const diffScrollDir: number = position[1] - this.startPosition[1];
      this.isScrolling = Math.abs(diffScrollDir) > Math.abs(diffMainDir);
    }

    if (this.isScrolling) {
      this.setState({ index: -1 });
      return;
    }

    const diffPosition: number = this.getDiffPosition(position[0]);
    const newValue: number = this.getValueFromPosition(diffPosition);
    this.move(newValue);
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

    this.setState({ pending: true });

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'Left':
      case 'Down':
        e.preventDefault();
        this.moveDownByStep();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
      case 'Right':
      case 'Up':
        e.preventDefault();
        this.moveUpByStep();
        break;
      case 'Home':
        e.preventDefault();
        this.move(this.props.min);
        break;
      case 'End':
        e.preventDefault();
        this.move(this.props.max);
        break;
      case 'PageDown':
        e.preventDefault();
        this.moveDownByStep(this.props.pageFn!(this.props.step));
        break;
      case 'PageUp':
        e.preventDefault();
        this.moveUpByStep(this.props.pageFn!(this.props.step));
        break;
      default:
    }
  };

  onSliderMouseDown = (e: React.MouseEvent) => {
    if (this.props.disabled || e.button === 2) return;

    this.setState({ pending: true });
    const nativeEvent: MouseEvent = e.nativeEvent;
    
    if (!this.props.snapDragDisabled) {
      const position = this.getMousePosition(nativeEvent);
      this.forceValueFromPosition(position[0], (i: number) => {
        this.start(i, position[0]);
        addListener(this.getMouseEventMap());
      });
    }

    pauseEvent(nativeEvent);
  };

  onSliderClick = (e: React.MouseEvent) => {
    if (this.props.disabled) return;
    
    if (this.props.onSliderClick && !this.hasMoved) {
      const nativeEvent = e.nativeEvent;
      const position = this.getMousePosition(nativeEvent);
      const valueAtPos = trimAlignValue(
        this.calculateValue(this.calculateOffsetFromPosition(position[0])),
        this.props
      );
      this.props.onSliderClick(valueAtPos);
    }
  };

  getValue() {
    return prepareOutValue(this.state.value);
  }

  getClosestIndex(pixelOffset: number) {
    let minDist: number = Number.MAX_VALUE;
    let closestIndex: number = -1;

    this.state.value.forEach((val, i) => {
      const offset = this.calculateOffset(val);
      const dist = Math.abs(pixelOffset - offset);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    return closestIndex;
  }

  getMousePosition(e: MouseEvent): number[] {
    return [
      e[`page${this.axisKey()}` as keyof MouseEvent] as number,
      e[`page${this.orthogonalAxisKey()}` as keyof MouseEvent] as number
    ];
  }

  getTouchPosition(e: TouchEvent): number[] {
    const touch = e.touches[0];
    return [
      touch[`page${this.axisKey()}` as keyof Touch] as number,
      touch[`page${this.orthogonalAxisKey()}` as keyof Touch] as number
    ];
  }

  getKeyDownEventMap(): {} {
    return {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp,
      focusout: this.onBlur,
    };
  }

  getMouseEventMap(): {} {
    return {
      mousemove: this.onMouseMove,
      mouseup: this.onMouseUp,
    };
  }

  getTouchEventMap(): {} {
    return {
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd,
    };
  }

  getValueFromPosition(position: number) {
    const diffValue: number = (position / (this.state.sliderLength - this.state.thumbSize)) * 
                     (this.props.max - this.props.min);
    return trimAlignValue(this.state.startValue + diffValue, this.props);
  }

  getDiffPosition(position: number) {
    let diffPosition: number = position - this.state.startPosition;
    if (this.props.invert) diffPosition *= -1;
    return diffPosition;
  }

  createOnKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (this.props.disabled) return;
    this.start(i);
    addListener(this.getKeyDownEventMap());
    pauseEvent(e.nativeEvent);
  };

  createOnMouseDown = (i: number) => (e: React.MouseEvent) => {
    if (this.props.disabled || e.button === 2) return;
    
    this.setState({ pending: true });
    const position = this.getMousePosition(e.nativeEvent);
    this.start(i, position[0]);
    addListener(this.getMouseEventMap());
    pauseEvent(e.nativeEvent);
  };

  createOnTouchStart = (i: number) => (e: React.TouchEvent) => {
    if (this.props.disabled || e.touches.length > 1) return;
    
    this.setState({ pending: true });
    const position = this.getTouchPosition(e.nativeEvent as unknown as TouchEvent);
    this.startPosition = position;
    this.isScrolling = undefined;
    this.start(i, position[0]);
    addListener(this.getTouchEventMap());
    stopPropagation(e.nativeEvent);
  };

  handleResize = () => {
    const resizeTimeout = window.setTimeout(() => {
      this.pendingResizeTimeouts.shift();
      this.resize();
    }, 0);
    this.pendingResizeTimeouts.push(resizeTimeout);
  };

  resize() {
    const slider: HTMLDivElement | null = this.resizeElementRef.current;
    const thumb: HTMLDivElement | null = this.thumbRefs[0];
    
    if (!slider || !thumb) {
      return
    }

    const sizeKey: "clientHeight" | "clientWidth" = this.sizeKey();
    const sliderRect: DOMRect = slider.getBoundingClientRect();
    const sliderSize: number = slider[this.sizeKey() as 'clientWidth' | 'clientHeight'];
    const sliderMax: number = sliderRect[this.posMaxKey() as 'bottom' | 'right'];
    const sliderMin: number = sliderRect[this.posMinKey() as 'top' | 'left'];
    const thumbRect: DOMRect = thumb.getBoundingClientRect();
    const thumbSize: number = thumbRect[sizeKey.replace('client', '').toLowerCase() as 'width' | 'height'];

    const upperBound = sliderSize - thumbSize;
    const sliderLength = Math.abs(sliderMax - sliderMin);

    if (
      this.state.upperBound !== upperBound ||
      this.state.sliderLength !== sliderLength ||
      this.state.thumbSize !== thumbSize
    ) {
      this.setState({
        upperBound,
        sliderLength,
        thumbSize,
      });
    }
  }

  calculateOffset(value: number) {
    const range: number = this.props.max - this.props.min;
    return range === 0 ? 0 : ((value - this.props.min) / range) * this.state.upperBound;
  }

  calculateValue(offset: number) {
    return (offset / this.state.upperBound) * (this.props.max - this.props.min) + this.props.min;
  }

  calculateOffsetFromPosition(position: number) {
    if (!this.slider) {
      return 0;
    }
    
    const sliderRect = this.slider.getBoundingClientRect();
    const sliderMax = sliderRect[this.posMaxKey() as 'bottom' | 'right'];
    const sliderMin = sliderRect[this.posMinKey() as 'top' | 'left'];
    const windowOffset = window[`page${this.axisKey()}Offset` as 'pageXOffset' | 'pageYOffset'];
    const sliderStart = windowOffset + (this.props.invert ? sliderMax : sliderMin);

    let pixelOffset = position - sliderStart;
    if (this.props.invert) {
      pixelOffset = this.state.sliderLength - pixelOffset;
    }
    return pixelOffset - this.state.thumbSize / 2;
  }

  forceValueFromPosition(position: number, callback: (i: number) => void) {
    const pixelOffset: number = this.calculateOffsetFromPosition(position);
    const closestIndex: number = this.getClosestIndex(pixelOffset);
    const nextValue: number = trimAlignValue(this.calculateValue(pixelOffset), this.props);

    const value = [...this.state.value];
    value[closestIndex] = nextValue;

    for (let i = 0; i < value.length - 1; i += 1) {
      if (value[i + 1] - value[i] < this.props.minDistance) return;
    }

    this.fireChangeEvent('onBeforeChange');
    this.hasMoved = true;
    this.setState({ value }, () => {
      callback(closestIndex);
      this.fireChangeEvent('onChange');
    });
  }

  clearPendingResizeTimeouts() {
    while (this.pendingResizeTimeouts.length) {
      clearTimeout(this.pendingResizeTimeouts.shift()!);
    }
  }

  private start(i: number, position?: number) {
    
    let thumbRef: HTMLDivElement | null = this.thumbRefs[i];
    if (thumbRef) {
      thumbRef.focus();
    }
    
    const { zIndices } = this.state;
    zIndices.splice(zIndices.indexOf(i), 1);
    zIndices.push(i);

    this.setState(prevState => ({
      startValue: prevState.value[i],
      startPosition: position ?? prevState.startPosition,
      index: i,
      zIndices,
    }));
  }

  private moveUpByStep(step: number = this.props.step) {
    const oldValue: number = this.state.value[this.state.index];
    const newValue: number = this.props.invert && this.props.orientation === 'horizontal' 
      ? oldValue - step 
      : oldValue + step;
    this.move(Math.min(trimAlignValue(newValue, this.props), this.props.max));
  }

  private moveDownByStep(step = this.props.step) {
    const oldValue: number = this.state.value[this.state.index];
    const newValue: number = this.props.invert && this.props.orientation === 'horizontal' 
      ? oldValue + step 
      : oldValue - step;
    this.move(Math.max(trimAlignValue(newValue, this.props), this.props.min));
  }

  private move(newValue: number) {
    const value: number[] = [...this.state.value];
    const { index } = this.state;
    const { length } = value;
    const oldValue: number = value[index];

    if (newValue === oldValue) {
      return;
    }

    if (!this.hasMoved) { 
      this.fireChangeEvent('onBeforeChange')
    }

    this.hasMoved = true;

    const { pearling, max, min, minDistance } = this.props;

    if (!pearling) {
      if (index > 0) {
        const valueBefore = value[index - 1];
        if (newValue < valueBefore + minDistance) {
          newValue = valueBefore + minDistance;
        }
      }

      if (index < length - 1) {
        const valueAfter = value[index + 1];
        if (newValue > valueAfter - minDistance) {
          newValue = valueAfter - minDistance;
        }
      }
    }

    value[index] = newValue;

    if (pearling && length > 1) {
      if (newValue > oldValue) {
        this.pushSucceeding(value, minDistance, index);
        trimSucceeding(length, value, minDistance, max);
      } else if (newValue < oldValue) {
        this.pushPreceding(value, minDistance, index);
        trimPreceding(length, value, minDistance, min);
      }
    }

    this.setState({ value }, () => this.fireChangeEvent('onChange'));
  }

  private pushSucceeding(value: number[], minDistance: number, index: number) {
    for (
      let i = index, padding = value[i] + minDistance;
      value[i + 1] !== undefined && padding > value[i + 1];
      i += 1, padding = value[i] + minDistance
    ) {
      value[i + 1] = alignValue(padding, this.props);
    }
  }

  private pushPreceding(value: number[], minDistance: number, index: number) {
    for (
      let i = index, padding = value[i] - minDistance;
      value[i - 1] !== undefined && padding < value[i - 1];
      i -= 1, padding = value[i] - minDistance
    ) {
      value[i - 1] = alignValue(padding, this.props);
    }
  }

  private axisKey(): "X" | "Y" {
    return this.props.orientation === 'vertical' ? 'Y' : 'X';
  }

  private orthogonalAxisKey(): "X" | "Y" {
    return this.props.orientation === 'vertical' ? 'X' : 'Y';
  }

  private posMinKey() {
    if (this.props.orientation === 'vertical') {
      return this.props.invert ? 'bottom' : 'top';
    }
    return this.props.invert ? 'right' : 'left';
  }

  private posMaxKey() {
    if (this.props.orientation === 'vertical') {
      return this.props.invert ? 'top' : 'bottom';
    }
    return this.props.invert ? 'left' : 'right';
  }

  private sizeKey() {
    return this.props.orientation === 'vertical' ? 'clientHeight' : 'clientWidth';
  }

  private fireChangeEvent(event: ChangeEventName) {
    const handler = this.props[event];
    if (handler) {
      handler(prepareOutValue(this.state.value), this.state.index);
    }
  }

  private buildThumbStyle(offset: number, i: number) {
    return {
      position: 'absolute',
      touchAction: 'none',
      willChange: this.state.index >= 0 ? this.posMinKey() : undefined,
      zIndex: this.state.zIndices.indexOf(i) + 1,
      [this.posMinKey()]: `${offset}px`
    } as React.CSSProperties;
  }

  private buildTrackStyle(min: number, max: number) {
    return {
      position: 'absolute',
      willChange: this.state.index >= 0 ? `${this.posMinKey()},${this.posMaxKey()}` : undefined,
      [this.posMinKey()]: `${min}px`,
      [this.posMaxKey()]: `${max}px`
    } as React.CSSProperties;
  }

  private buildMarkStyle(offset: number) {
    return {
      position: 'absolute',
      [this.posMinKey()]: `${offset}px`
    } as React.CSSProperties;
  }

  private renderThumb = (style: React.CSSProperties, i: number) => {
    const className = `${this.props.thumbClassName} ${this.props.thumbClassName}-${i} ${
      this.state.index === i ? this.props.thumbActiveClassName : ''
    }`;

    const props = {
      ref: (r: HTMLDivElement | null) => {
        this.thumbRefs[i] = r;
      },
      className,
      style,
      onMouseDown: this.createOnMouseDown(i),
      onTouchStart: this.createOnTouchStart(i),
      onFocus: this.createOnKeyDown(i),
      tabIndex: 0,
      role: 'slider',
      'aria-orientation': this.props.orientation,
      'aria-valuenow': this.state.value[i],
      'aria-valuemin': this.props.min,
      'aria-valuemax': this.props.max,
      'aria-label': Array.isArray(this.props.ariaLabel)
        ? this.props.ariaLabel[i]
        : this.props.ariaLabel,
      'aria-labelledby': Array.isArray(this.props.ariaLabelledBy)
        ? this.props.ariaLabelledBy[i]
        : this.props.ariaLabelledBy,
      'aria-disabled': this.props.disabled,
    } as any;

    const state = {
      index: i,
      value: prepareOutValue(this.state.value),
      valueNow: this.state.value[i],
    };

    if (this.props.ariaValueText) {
      props['aria-valuetext'] =
        typeof this.props.ariaValueText === 'string'
          ? this.props.ariaValueText
          : this.props.ariaValueText(state);
    }

    return React.cloneElement(this.props.renderThumb!(props, state), {
      key: `${this.props.thumbClassName}-${i}`
    });
  };

  private renderThumbs(offset: number[]) {
    return offset.map((off, i) => 
      this.renderThumb(this.buildThumbStyle(off, i), i)
    );
  }

  private renderTrack(i: number, offsetFrom: number, offsetTo: number): ReactNode {
    const props = {
      className: `${this.props.trackClassName} ${this.props.trackClassName}-${i}`,
      style: this.buildTrackStyle(offsetFrom, this.state.upperBound - offsetTo),
    };
    const state = {
      index: i,
      value: prepareOutValue(this.state.value),
    };
    // Pass key directly to the element instead of in props
    return React.cloneElement<Props>(this.props.renderTrack!(props, state), {
      key: `${this.props.trackClassName}-${i}`
    });
  };

  private renderTracks(offset: number[]): ReactNode {
    const tracks = [];
    const lastIndex = offset.length - 1;

    tracks.push(this.renderTrack(0, 0, offset[0]));

    for (let i = 0; i < lastIndex; i += 1) {
      tracks.push(this.renderTrack(i + 1, offset[i], offset[i + 1]));
    }

    tracks.push(this.renderTrack(lastIndex + 1, offset[lastIndex], this.state.upperBound));

    return tracks;
  }

  private renderMarks(): ReactNode {
    
    if (!this.props.marks) {
      return null
    }
    
    let marksToRender: number[] = [];
    const marks = this.props.marks;

    if (typeof marks === 'boolean') {
      for (let i = this.props.min; i <= this.props.max; i++) {
        marksToRender.push(i);
      }
    }

    else if (typeof marks === 'number') {
      for (let i = this.props.min; i <= this.props.max; i += marks) {
        marksToRender.push(i);
      }
    }

    else {
      marksToRender = marks.map((m: string | number) => {
        if (typeof m === 'string') {
          return Number.parseFloat(m);
        } else {
          return m;
        }
      });
    }

    return marksToRender
      .filter(m => !Number.isNaN(m)) // Filter out invalid numbers
      .sort((a, b) => a - b)
      .map(mark => {
        const offset = this.calculateOffset(mark);
        const props = {
          className: this.props.markClassName,
          style: this.buildMarkStyle(offset),
        };
        // Pass key directly to the element instead of in props
        return React.cloneElement(this.props.renderMark!(props), {
          key: mark.toString()
        });
      });
  }

  render(): React.ReactElement<any, any> {
    const offset: number[] = this.state.value.map(val => this.calculateOffset(val));
    const tracks: React.ReactNode = this.props.withTracks ? this.renderTracks(offset) : null;
    const thumbs: React.ReactNode[] = this.renderThumbs(offset);
    const marks: React.ReactNode = this.props.marks ? this.renderMarks() : null;

    return (
      <div
        ref={el => {
          this.slider = el;
          this.resizeElementRef.current = el;
        }}
        style={{ position: 'relative' }}
        className={`${this.props.className}${this.props.disabled ? ' disabled' : ''}`}
        onMouseDown={this.onSliderMouseDown}
        onClick={this.onSliderClick}
      >
        {tracks}
        {thumbs}
        {marks}
      </div>
    );
  }
}

export default ReactSlider;