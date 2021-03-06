import { CanvasGrid } from "../../types/CanvasGrid";
import { ExportCanvasElement } from "../../types/ExportCanvas";
export default abstract class CanvasElement {
    x: number;
    y: number;
    width: number;
    height: number;
    selected: boolean;
    selectable: boolean;
    protected constructor(x: number, y: number, width: number, height: number);
    draw(context: CanvasRenderingContext2D): void;
    abstract generateGrid(canvasGrid: CanvasGrid, gridPixelMerge: number): void;
    abstract toJSON(): ExportCanvasElement;
    static fromJSON(_json: ExportCanvasElement): CanvasElement;
    select(): void;
    deselect(): void;
}
