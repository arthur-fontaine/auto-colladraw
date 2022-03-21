import CanvasElement from "./CanvasElement";
import {CanvasGrid} from "../../types/CanvasGrid";
import {ExportCanvasElement, ExportCanvasText} from "../../types/ExportCanvas";

export default class CanvasText extends CanvasElement {
  text: string;
  font: string;
  color: string;
  highlightColor: string;
  highlighted: boolean;

  constructor(
    text: string,
    x: number,
    y: number,
    font: string,
  ) {
    super(x, y, 0, 0);
    this.text = text;
    this.font = font;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.highlighted) {
      this.highlight(context, false);
    }

    context.font = this.font;
    context.fillStyle = this.color;

    this.width = context.measureText(this.text).width;
    this.height = parseInt(this.font.match(/\d+/)[0] ?? '20');

    context.fillText(this.text, this.x, this.y);

    if (this.selected) {
      context.fillStyle = '#ff0000';
      context.strokeStyle = '#ff0000';
      context.lineWidth = 2;
      context.moveTo(this.x, this.y + 3);

      context.beginPath();
      context.lineTo(this.x, this.y + 3);
      context.lineTo(this.x + this.width, this.y + 3);
      context.stroke();
      context.closePath();
    }
  }

  generateGrid(canvasGrid: CanvasGrid, gridPixelMerge: number) {
    let minI = this.y - this.height;
    minI -= (minI % gridPixelMerge);
    let minJ = this.x;
    minJ -= (minJ % gridPixelMerge);
    let maxI = this.y;
    maxI += (gridPixelMerge - (maxI % gridPixelMerge));
    let maxJ = this.x + this.width;
    maxJ += (gridPixelMerge - (maxJ % gridPixelMerge));

    for (let i = minI; i <= maxI; i += gridPixelMerge) {
      for (let j = minJ; j <= maxJ; j += gridPixelMerge) {
        canvasGrid[i][j] = this;
      }
    }
  }

  highlight(context: CanvasRenderingContext2D, redraw: boolean = true) {
    context.fillStyle = this.highlightColor;
    context.globalCompositeOperation = 'multiply';
    context.fillRect(this.x, this.y - this.height, this.width, this.height);
    context.globalCompositeOperation = 'source-over';
    this.highlighted = true;

    if (redraw) {
      this.draw(context);
    }
  }

  toJSON(): ExportCanvasElement {
    return {
      type: "Text",
      x: this.x,
      y: this.y,
      text: this.text,
      font: this.font,
      color: this.color,
      highlightColor: this.highlightColor,
      highlighted: this.highlighted,
    };
  }

  static fromJSON(json: ExportCanvasText) {
    const text = new CanvasText(
      json.text,
      json.x,
      json.y,
      json.font,
    );
    text.color = json.color;
    text.highlightColor = json.highlightColor;
    text.highlighted = json.highlighted;
    return text;
  }
}
