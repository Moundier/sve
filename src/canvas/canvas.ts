
export const canvasGrid = {
   spacing: 10,          // distance between dot centers (px)
   dotRadius: 1.5,       // dot radius (px)
   dotColor: 'rgba(66, 66, 66, 0.15)',
   backgroundColor: '#ebebebff',
   offsetX: 0,           // canvas-space offset
   offsetY: 0,
};

export class Canvas {

   readonly element: HTMLElement;
   readonly content: HTMLDivElement;
   private translateX: number = 0;
   private translateY: number = 0;

   constructor(htmlElement: HTMLElement) {
      this.element = htmlElement;
      this.content = document.createElement('div');
      this.content.className = 'canvas-content';
      this.element.appendChild(this.content);

      this.addGrid();
      this.addGridEvent();
   }

   private addGrid(): void {
      const { backgroundColor, dotRadius, dotColor, spacing, } = canvasGrid
      this.element.style.backgroundColor = backgroundColor;
      this.element.style.backgroundImage = `radial-gradient(circle ${dotRadius}px, ${dotColor} 99%, transparent 100%)`;
      this.element.style.backgroundSize = `${spacing}px ${spacing}px`;
      this.changeGrid();
   }

   private changeGrid(): void {
      const { spacing } = canvasGrid;
      const base: number = spacing / 4; // 2, 4
      const x: number = (base + this.translateX) % spacing;
      const y: number = (base + this.translateY) % spacing;
      this.element.style.backgroundPosition = `${x}px ${y}px`;
      this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
   }

   private addGridEvent(): void {

      let func = (e: WheelEvent) => {
         e.preventDefault();
         this.translateX -= e.deltaX;
         this.translateY -= e.deltaY;
         this.changeGrid();
      }

      this.element.addEventListener('wheel', func, { passive: false });
   }
}
