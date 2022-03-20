import CanvasElement from "./CanvasElement";
import { CanvasGrid } from "../../types/CanvasGrid";
import { ExportCanvasElement, ExportCanvasText } from "../../types/ExportCanvas";
export default class CanvasText extends CanvasElement {
    text: string;
    font: string;
    color: string;
    highlightColor: string;
    highlighted: boolean;
    constructor(text: string, x: number, y: number, font: string);
    draw(context: CanvasRenderingContext2D): void;
    generateGrid(canvasGrid: CanvasGrid, gridPixelMerge: number): void;
    highlight(context: CanvasRenderingContext2D, redraw?: boolean): void;
    toJSON(): ExportCanvasElement;
    static fromJSON(json: ExportCanvasText): CanvasText;
}
