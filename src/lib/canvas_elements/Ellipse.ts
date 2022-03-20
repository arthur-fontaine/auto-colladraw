import Shape from "./Shape";
import {CanvasGrid} from "../../types/CanvasGrid";
import {ExportShape} from "../../types/ExportCanvas";

export default class Ellipse extends Shape {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  generateGrid(canvasGrid: CanvasGrid, gridPixelMerge: number) {
    let minI = this.height < 0 ? this.y + this.height : this.y;
    minI -= (minI % gridPixelMerge);
    let minJ = this.width < 0 ? this.x + this.width : this.x;
    minJ -= (minJ % gridPixelMerge);
    let maxI = this.height < 0 ? this.y : this.y + this.height;
    maxI += (gridPixelMerge - (maxI % gridPixelMerge));
    let maxJ = this.width < 0 ? this.x : this.x + this.width;
    maxJ += (gridPixelMerge - (maxJ % gridPixelMerge));

    for (let i = minI; i <= maxI; i += gridPixelMerge) {
      for (let j = minJ; j <= maxJ; j += gridPixelMerge) {
        canvasGrid[i][j] = this;
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    super.draw(context, () => {
      context.ellipse(Math.abs(this.x + this.width / 2), Math.abs(this.y + this.height / 2), Math.abs(this.width / 2), Math.abs(this.height / 2), 0, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
    });
  }

  toJSON() {
    return {
      type: 'Ellipse' as 'Ellipse',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    };
  }

  static fromJSON(json: ExportShape): Ellipse {
    const ellipse = new Ellipse(json.x, json.y, json.width, json.height);
    ellipse.fillColor = json.fillColor;
    ellipse.strokeColor = json.strokeColor;
    ellipse.strokeWidth = json.strokeWidth;
    return ellipse;
  }
}
