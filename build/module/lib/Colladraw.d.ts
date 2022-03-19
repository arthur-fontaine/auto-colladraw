import { CanvasElementType } from "./enums/CanvasElementType";
import { CanvasGrid } from "../types/CanvasGrid";
import { ExportCanvas } from "../types/ExportCanvas";
import CanvasElement from "./canvas_elements/CanvasElement";
export default class Colladraw {
    canvas: {
        canvas: HTMLCanvasElement;
        elements: CanvasElement[];
    };
    context: CanvasRenderingContext2D;
    grid: CanvasGrid;
    gridPixelMerge: number;
    background: HTMLCanvasElement;
    backgroundColor: string;
    private state;
    private onClickLocker;
    constructor(canvas: HTMLCanvasElement, gridPixelMerge?: number);
    private initGrid;
    generateGrid(): void;
    draw(clear?: boolean): void;
    addElement(element: CanvasElement, toAddToHistory?: boolean): void;
    removeElement(elementToDelete: CanvasElement): void;
    get elements(): CanvasElement[];
    addToHistory(): void;
    undo(): void;
    redo(): void;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(_event: MouseEvent): void;
    onClick(event: MouseEvent): void;
    changeFillColor(color: string): void;
    changeStrokeColor(color: string): void;
    changeStrokeWidth(width: number): void;
    changeToolType(type: CanvasElementType): void;
    toJSON(): ExportCanvas;
    load(json: ExportCanvas): void;
    clear(): void;
    toDataURL(): string;
    savePNG(name?: string): void;
    savePDF(name?: string): void;
}
