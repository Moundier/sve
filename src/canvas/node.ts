import { canvasGrid } from './canvas';

export type NodeOptions = {
    label?: string;
    image?: string;
    entrypoint?: string;
}

export type NodePosition = {
    x: number;
    y: number;
};

export class Node {

    readonly el: HTMLDivElement;
    private position: NodePosition;

    private dragging: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private originX: number = 0;
    private originY: number = 0;

    constructor(
        container: HTMLElement, 
        position: NodePosition, 
        options: NodeOptions = {}
    ) {
        this.position = this.snap(position);

        this.el = document.createElement('div');
        this.el.className = 'node';

        if (options.entrypoint) {
            this.el.classList.add('entrypoint');
        }

        if (options.image) {
            const img: HTMLImageElement = document.createElement('img');
            img.src = options.image;
            img.draggable = false;
            img.className = 'node-icon';
            this.el.appendChild(img);
        }

        const label = document.createElement('div');
        label.className = 'node-label';
        // label.textContent = options.label ?? 'Node';
        this.el.appendChild(label);

        container.appendChild(this.el);

        this.updateDragAndDropElements();
        this.registerEvents();
    }

    private raiseElement(): void {
        this.el.parentElement?.appendChild(this.el);
    }

    private registerEvents(): void {
        
        const f1: ((e: PointerEvent) => void) = (e: PointerEvent) => {
            e.stopPropagation();
            this.raiseElement();

            this.dragging = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.originX = this.position.x;
            this.originY = this.position.y;

            this.el.setPointerCapture(e.pointerId);
        }

        const f2: ((e: PointerEvent) => void) = (e: PointerEvent) => {
            if (!this.dragging) return;

            const dx = e.clientX - this.startX;
            const dy = e.clientY - this.startY;

            this.position = {
                x: this.originX + dx,
                y: this.originY + dy,
            };

            this.updateDragAndDropElements(false); // no snap while dragging
        }

        const f3: EventListener = () => {
            if (!this.dragging) return;
            this.dragging = false;
            this.position = this.snap(this.position);
            this.updateDragAndDropElements();
        }
        
        const events: Record<string, EventListener> = {
            pointerdown: f1 as EventListener,
            pointermove: f2 as EventListener,
            pointerup:   f3 as EventListener,
        };

        this.el.addEventListener('pointerdown', events.pointerdown);
        this.el.addEventListener('pointermove', events.pointermove);
        this.el.addEventListener('pointerup', events.pointerup);
    }

    private snap(pos: NodePosition): NodePosition {
        const { spacing } = canvasGrid;

        return {
            x: Math.round(pos.x / spacing) * spacing,
            y: Math.round(pos.y / spacing) * spacing,
        };
    }

    private updateDragAndDropElements(snap = true) {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        console.log(snap);
    }

    public setPosition(pos: NodePosition) {
        this.position = this.snap(pos);
        this.updateDragAndDropElements();
    }

    public getPosition(): NodePosition {
        return { ...this.position };
    }
}
