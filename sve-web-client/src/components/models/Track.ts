export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrackedBox {
  frame: number;
  box: BoundingBox;
}

export class Track {
  id: number;
  private boxes: TrackedBox[];
  private lastFrame: number;
  private active: boolean;

  constructor(id: number, initialBox: BoundingBox, initialFrame: number) {
    this.id = id;
    this.boxes = [{ frame: initialFrame, box: initialBox }];
    this.lastFrame = initialFrame;
    this.active = true;
  }

  update(box: BoundingBox, frame: number): void {
    this.boxes.push({ frame, box });
    this.lastFrame = frame;
  }

  getLatestBox(): TrackedBox {
    return this.boxes[this.boxes.length - 1];
  }

  getLastFrame(): number {
    return this.lastFrame;
  }

  deactivate(): void {
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  getTrackLength(): number {
    return this.boxes.length;
  }

  toJSON(): { id: number, active: boolean, boxes: TrackedBox[] } {
    return {
      id: this.id,
      active: this.active,
      boxes: this.boxes,
    };
  }
}
