import type { JSX } from "react";

export interface Props {
  min: number;
  max: number;
  step: number;
  pageFn?: (step: number) => number;
  minDistance: number;
  defaultValue: number | number[];
  value: number | number[];
  orientation: 'horizontal' | 'vertical';
  className: string;
  thumbClassName: string;
  thumbActiveClassName: string;
  withTracks: boolean;
  trackClassName: string;
  pearling: boolean;
  disabled: boolean;
  snapDragDisabled: boolean;
  invert: boolean;
  marks?: number[] | string[];
  markClassName?: string;
  onBeforeChange?: (value: number | number[], index?: number) => void;
  onChange?: (value: number | number[], index?: number) => void;
  onAfterChange?: (value: number | number[], index?: number) => void;
  onSliderClick?: (value: number) => void;
  ariaLabel?: string | string[];
  ariaLabelledBy?: string | string[];
  ariaValueText?: string | ((state: any) => string);
  renderThumb?: (props: any, state: any) => JSX.Element;
  renderTrack?: (props: any, state: any) => JSX.Element;
  renderMark?: (props: any) => JSX.Element;
}

export interface State {
  index: number;
  upperBound: number;
  sliderLength: number;
  value: number[];
  zIndices: number[];
  pending: boolean;
  thumbSize: number;
  startValue: number;
  startPosition: number;
}