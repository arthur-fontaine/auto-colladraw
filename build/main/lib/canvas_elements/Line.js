"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasElement_1 = __importDefault(require("./CanvasElement"));
class Line extends CanvasElement_1.default {
    constructor(x, y, endX, endY) {
        super(x, y, 0, 0);
        this.endX = endX;
        this.endY = endY;
    }
    getCoordinates(startX = this.x, startY = this.y, endX = this.endX, endY = this.endY) {
        return [
            [startX, startY],
            [endX, endY]
        ];
    }
    generateGrid(canvasGrid, gridPixelMerge) {
        let minI = Math.min(this.y, this.endY);
        minI -= (minI % gridPixelMerge);
        let minJ = Math.min(this.x, this.endX);
        minJ -= (minJ % gridPixelMerge);
        let maxI = Math.max(this.y, this.endY);
        maxI += (gridPixelMerge - (maxI % gridPixelMerge));
        let maxJ = Math.max(this.x, this.endX);
        maxJ += (gridPixelMerge - (maxJ % gridPixelMerge));
        for (let i = minI; i <= minJ; i += gridPixelMerge) {
            for (let j = minJ; j <= maxJ; j += gridPixelMerge) {
                canvasGrid[i][j] = this;
            }
        }
    }
    draw(context) {
        this.width = Math.abs(this.x - this.endX);
        this.height = Math.abs(this.y - this.endY);
        context.strokeStyle = this.color || '#000';
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.endX, this.endY);
        context.lineWidth = 10;
        context.stroke();
        context.closePath();
        super.draw(context);
    }
    static fromJSON(json) {
        const line = new Line(json.x, json.y, json.endX, json.endY);
        line.color = json.color;
        return line;
    }
    toJSON() {
        return {
            type: 'Line',
            x: this.x,
            y: this.y,
            endX: this.endX,
            endY: this.endY,
            color: this.color
        };
    }
}
exports.default = Line;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY2FudmFzX2VsZW1lbnRzL0xpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvRUFBNEM7QUFHNUMsTUFBcUIsSUFBSyxTQUFRLHVCQUFhO0lBSzdDLFlBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZLEVBQUUsSUFBWTtRQUMxRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELGNBQWMsQ0FBQyxTQUFpQixJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQWlCLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBZSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQWUsSUFBSSxDQUFDLElBQUk7UUFDakgsT0FBTztZQUNMLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUNoQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7U0FDYixDQUFDO0lBQ0osQ0FBQztJQUVELFlBQVksQ0FBQyxVQUFzQixFQUFFLGNBQXNCO1FBQ3pELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENB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