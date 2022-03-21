import Shape from "./canvas_elements/Shape.js";
import { CanvasElementType } from "./enums/CanvasElementType.js";
import Rectangle from "./canvas_elements/Rectangle.js";
import Ellipse from "./canvas_elements/Ellipse.js";
import Triangle from "./canvas_elements/Triangle.js";
import AnchorConditions from "./utils/AnchorConditions.js";
import kebabize from "./utils/kebabize.js";
import Polygon from "./canvas_elements/Polygon.js";
import CanvasEvents from "./events/CanvasEvents.js";
import CanvasText from "./canvas_elements/CanvasText.js";
import Line from "./canvas_elements/Line.js";
import ResizeFunctions from "./utils/ResizeFunctions.js";
export default class Colladraw {
    canvas;
    context;
    grid;
    gridPixelMerge = 5;
    background;
    backgroundColor = '#fafafa';
    disableBackspace = false;
    state = {
        variables: {},
        history: {
            undo: [],
            redo: []
        }
    };
    onClickLocker = false;
    constructor(canvas, gridPixelMerge = 5) {
        document.head.appendChild(document.createElement('script')).src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.canvas = {
            canvas,
            elements: []
        };
        this.gridPixelMerge = gridPixelMerge;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.background = canvas;
        this.addToHistory();
        this.initGrid();
        this.canvas.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.canvas.addEventListener('click', this.onClick.bind(this));
        canvas.addEventListener('anchor-point-hovered', (e) => {
            if (e.detail.anchorPoint === 'top') {
                document.body.style.cursor = 'ns-resize';
            }
            else if (e.detail.anchorPoint === 'bottom') {
                document.body.style.cursor = 'ns-resize';
            }
            else if (e.detail.anchorPoint === 'left') {
                document.body.style.cursor = 'ew-resize';
            }
            else if (e.detail.anchorPoint === 'right') {
                document.body.style.cursor = 'ew-resize';
            }
            else if (e.detail.anchorPoint === 'topLeft') {
                document.body.style.cursor = 'nwse-resize';
            }
            else if (e.detail.anchorPoint === 'topRight') {
                document.body.style.cursor = 'nesw-resize';
            }
            else if (e.detail.anchorPoint === 'bottomLeft') {
                document.body.style.cursor = 'nesw-resize';
            }
            else if (e.detail.anchorPoint === 'bottomRight') {
                document.body.style.cursor = 'nwse-resize';
            }
            else {
                document.body.style.cursor = 'default';
            }
        });
        canvas.addEventListener('anchor-point-leave', () => {
            document.body.style.cursor = 'default';
        });
        window.addEventListener('keydown', (e) => {
            if (!this.disableBackspace && e.key === 'Backspace') {
                if (this.state.selectedElement) {
                    this.removeElement(this.state.selectedElement);
                    this.draw();
                    this.generateGrid();
                    this.state.selectedElement.deselect();
                    this.state.selectedElement = false;
                    this.state.selectionTransform = false;
                }
            }
            if (e.key === 'z' && e.ctrlKey) {
                this.undo();
            }
            if (e.key === 'y' && e.ctrlKey) {
                this.redo();
            }
        });
    }
    initGrid() {
        this.grid = [];
        for (let i = 0; i < this.canvas.canvas.height; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.canvas.canvas.width; j++) {
                this.grid[i].push(null);
            }
        }
    }
    generateGrid() {
        if (this.elements.length > 0) {
            this.elements.forEach((element) => element.generateGrid(this.grid, this.gridPixelMerge));
        }
        else {
            this.initGrid();
        }
    }
    getClickedElement(event) {
        return this.grid[event.offsetY + this.gridPixelMerge - (event.offsetY % this.gridPixelMerge)][event.offsetX + this.gridPixelMerge - (event.offsetX % this.gridPixelMerge)];
    }
    draw(clear = true) {
        if (clear) {
            this.context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        }
        const elementsToDraw = this.canvas.elements.concat(this.state.drawing && (this.state.drawing.shape || this.state.drawing.line) ? this.state.drawing.shape ?? this.state.drawing.line : []);
        elementsToDraw.forEach(element => {
            if (element instanceof Shape) {
                if (this.state.variables.fillColor) {
                    element.fillColor = this.state.variables.fillColor;
                }
                if (this.state.variables.strokeColor) {
                    element.strokeColor = this.state.variables.strokeColor;
                }
                if (this.state.variables.strokeWidth) {
                    element.strokeWidth = this.state.variables.strokeWidth;
                }
            }
            else if (element instanceof CanvasText) {
                if (this.state.variables.fillColor) {
                    element.color = this.state.variables.fillColor;
                }
                if (this.state.variables.font) {
                    element.font = this.state.variables.font;
                }
            }
            element.draw(this.context);
        });
    }
    addElement(element, toAddToHistory = true) {
        this.canvas.elements.push(element);
        this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementCreated(element));
        if (toAddToHistory) {
            this.addToHistory();
        }
    }
    removeElement(elementToDelete) {
        this.canvas.elements = this.canvas.elements.filter(element => element !== elementToDelete);
        this.addToHistory();
    }
    get elements() {
        return this.canvas.elements;
    }
    addToHistory() {
        this.state.history.current = this.toJSON();
        this.state.history.undo.push(this.state.history.current);
    }
    undo() {
        this.state.history.redo.push(this.state.history.current);
        this.state.history.current = this.state.history.undo.pop();
        if (this.state.history.current) {
            this.load(this.state.history.current);
        }
        this.draw();
    }
    redo() {
        this.state.history.undo.push(this.state.history.current);
        this.state.history.current = this.state.history.redo.pop();
        if (this.state.history.current) {
            this.load(this.state.history.current);
        }
        this.draw();
    }
    onMouseDown(event) {
        const clickedElement = this.getClickedElement(event);
        if (!clickedElement) {
            if (this.state.selectedElement)
                this.state.selectedElement.deselect();
            this.state.selectedElement = false;
            this.state.selectionTransform = false;
            this.onClickLocker = true;
            const x = event.offsetX;
            const y = event.offsetY;
            const toolType = this.state.variables.toolType ?? CanvasElementType.RECTANGLE;
            this.state = {
                ...this.state,
                variables: { toolType },
                // @ts-ignore
                typing: toolType === CanvasElementType.TEXT ? {
                    ...this.state.typing,
                    text: 'Hello World',
                    font: '20px Arial'
                } : false,
                // @ts-ignore
                drawing: toolType != CanvasElementType.TEXT ? {
                    ...this.state.drawing,
                    color: '#000',
                    strokeWidth: 1,
                    startPoint: {
                        x: event.offsetX,
                        y: event.offsetY
                    }
                } : false
            };
            if (this.state.variables.toolType) {
                let element;
                switch (this.state.variables.toolType) {
                    case CanvasElementType.RECTANGLE:
                        element = new Rectangle(x, y, 0, 0);
                        break;
                    case CanvasElementType.ELLIPSE:
                        element = new Ellipse(x, y, 0, 0);
                        break;
                    case CanvasElementType.TRIANGLE:
                        element = new Triangle(x, y, 0, 0);
                        break;
                    case CanvasElementType.LINE:
                        element = new Line(x, y, 0, 0);
                        break;
                    case CanvasElementType.TEXT:
                        element = new CanvasText('Hello world', x, y, this.state.variables.font ?? '12px Arial');
                        element.y += parseInt(element.font.match(/\d+/)[0] ?? '20');
                        break;
                    case CanvasElementType.PENCIL:
                        if (this.state.drawing)
                            this.state.drawing.pencil = true;
                        break;
                    case CanvasElementType.ERASER:
                        if (this.state.drawing)
                            this.state.drawing.eraser = true;
                        break;
                    default:
                        element = new Rectangle(x, y, 0, 0);
                        break;
                }
                if (element instanceof Shape || element instanceof Line) {
                    if (element instanceof Shape) {
                        element.strokeColor = '#000';
                    }
                    else if (element instanceof Line) {
                        element.color = '#000';
                    }
                    this.state = {
                        ...this.state,
                        drawing: {
                            ...this.state.drawing,
                            shape: element instanceof Shape ? element : undefined,
                            line: element instanceof Line ? element : undefined
                        }
                    };
                }
                else if (element instanceof CanvasText) {
                    element.color = '#000';
                    this.state = {
                        ...this.state,
                        typing: {
                            ...this.state.typing,
                            text: element.text,
                            textElement: element
                        }
                    };
                    this.draw();
                }
            }
        }
        else {
            const gripMargin = 20;
            let anchorFound = false;
            Object.entries(AnchorConditions).forEach(([anchorConditionName, anchorCondition]) => {
                if (!anchorFound && !(this.state.selectedElement instanceof CanvasText) && anchorCondition(this.grid, gripMargin, event, this.gridPixelMerge)) {
                    this.state = {
                        ...this.state,
                        selectionTransform: {
                            resize: {
                                grip: kebabize(anchorConditionName)
                            }
                        }
                    };
                    anchorFound = true;
                }
            });
            if (!anchorFound && this.state.selectedElement) {
                this.state = {
                    ...this.state,
                    selectionTransform: {
                        translate: {
                            grip: {
                                x: event.offsetX - this.state.selectedElement.x,
                                y: event.offsetY - this.state.selectedElement.y
                            }
                        }
                    }
                };
            }
        }
    }
    onMouseMove(event) {
        if (this.state.selectedElement) {
            let anchorFound = false;
            Object.entries(AnchorConditions).forEach(([anchorConditionName, anchorCondition]) => {
                if (!anchorFound && !(this.state.selectedElement instanceof CanvasText) && anchorCondition(this.grid, 20, event, this.gridPixelMerge)) {
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasAnchorPointHovered(anchorConditionName, event));
                    anchorFound = true;
                }
            });
            if (!anchorFound) {
                this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasAnchorPointLeave(event));
            }
        }
        if (!this.state.selectedElement) {
            const x = event.offsetX;
            const y = event.offsetY;
            if (this.state.drawing) {
                const shouldRedraw = this.elements.some(element => element.selected);
                this.elements.forEach(element => {
                    element.deselect();
                });
                if (shouldRedraw) {
                    this.draw();
                }
            }
            if (this.state.drawing && this.state.drawing.pencil) {
                const point = new Rectangle(x, y, 5, 5);
                point.selectable = false;
                this.addElement(point, false);
            }
            else if (this.state.drawing && this.state.drawing.eraser) {
                this.context.globalCompositeOperation = 'destination-out';
                const point = new Rectangle(x, y, 5, 5);
                point.fillColor = this.backgroundColor;
                point.strokeColor = this.backgroundColor;
                point.selectable = false;
                this.addElement(point, false);
                this.context.globalCompositeOperation = 'source-over';
            }
            else if (this.state.drawing) {
                this.state = {
                    ...this.state,
                    drawing: {
                        ...this.state.drawing,
                        endPoint: { x, y }
                    }
                };
                if (this.state.drawing && this.state.drawing.shape) {
                    this.state.drawing.shape.width = this.state.drawing.endPoint.x - this.state.drawing.startPoint.x;
                    this.state.drawing.shape.height = this.state.drawing.endPoint.y - this.state.drawing.startPoint.y;
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementMoved(this.state.drawing.shape, event));
                    //   if (this.state.drawing.shape.width < 0) {
                    //     this.state.drawing.shape.width = Math.abs(this.state.drawing.shape.width);
                    //     [this.state.drawing.startPoint.x, this.state.drawing.endPoint.x] = [this.state.drawing.endPoint.x, this.state.drawing.startPoint.x];
                    //     this.state.drawing.shape.x = this.state.drawing.startPoint.x;
                    //   }
                    //
                    //   if (this.state.drawing.shape.height < 0) {
                    //     this.state.drawing.shape.height = Math.abs(this.state.drawing.shape.height);
                    //     [this.state.drawing.startPoint.y, this.state.drawing.endPoint.y] = [this.state.drawing.endPoint.y, this.state.drawing.startPoint.y];
                    //     this.state.drawing.shape.y = this.state.drawing.startPoint.y;
                    //   }
                }
                else if (this.state.drawing && this.state.drawing.line) {
                    this.state.drawing.line.endX = this.state.drawing.endPoint.x;
                    this.state.drawing.line.endY = this.state.drawing.endPoint.y;
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementMoved(this.state.drawing.line, event));
                }
            }
        }
        else if (this.state.selectedElement && this.state.selectionTransform) {
            if (this.state.selectedElement) {
                if (this.state.selectionTransform.translate) {
                    const oldX = this.state.selectedElement.x;
                    const oldY = this.state.selectedElement.y;
                    this.state.selectedElement.x = event.offsetX - this.state.selectionTransform.translate.grip.x;
                    this.state.selectedElement.y = event.offsetY - this.state.selectionTransform.translate.grip.y;
                    if (this.state.selectedElement instanceof Line) {
                        this.state.selectedElement.endX = this.state.selectedElement.endX + (this.state.selectedElement.x - oldX);
                        this.state.selectedElement.endY = this.state.selectedElement.endY + (this.state.selectedElement.y - oldY);
                    }
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementMoved(this.state.selectedElement, event));
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementTransformed(this.state.selectedElement, {
                        type: 'translate',
                        x: this.state.selectionTransform.translate.grip.x,
                        y: this.state.selectionTransform.translate.grip.y,
                        oldX,
                        oldY
                    }));
                }
                else if (this.state.selectionTransform.resize) {
                    const oldX = this.state.selectedElement.x;
                    const oldY = this.state.selectedElement.y;
                    const oldWidth = this.state.selectedElement.width;
                    const oldHeight = this.state.selectedElement.height;
                    if (this.state.selectionTransform.resize.grip === 'top-left') {
                        ResizeFunctions.topLeft(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'top-right') {
                        ResizeFunctions.topRight(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'bottom-left') {
                        ResizeFunctions.bottomLeft(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'bottom-right') {
                        ResizeFunctions.bottomRight(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'top') {
                        ResizeFunctions.top(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'right') {
                        ResizeFunctions.right(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'bottom') {
                        ResizeFunctions.bottom(this.state, event);
                    }
                    else if (this.state.selectionTransform.resize.grip === 'left') {
                        ResizeFunctions.left(this.state, event);
                    }
                    this.canvas.canvas.dispatchEvent((CanvasEvents.CanvasElementTransformed(this.state.selectedElement, {
                        type: 'resize',
                        x: this.state.selectedElement.x,
                        y: this.state.selectedElement.y,
                        width: this.state.selectedElement.width,
                        height: this.state.selectedElement.height,
                        oldX,
                        oldY,
                        oldWidth,
                        oldHeight
                    })));
                }
            }
        }
        // if (this.state.selectionTransform || this.state.selectedShape || this.state.typing || this.state.typing) {
        if (Object.values(this.state).some(value => value)) {
            this.draw();
        }
    }
    onMouseUp(_event) {
        if (this.state.drawing && this.state.drawing.shape && this.state.drawing.shape.width !== 0 && this.state.drawing.shape.height !== 0) {
            this.addElement(this.state.drawing.shape);
        }
        else if (this.state.drawing && this.state.drawing.line) {
            this.addElement(this.state.drawing.line);
        }
        else if (this.state.drawing && (this.state.drawing.pencil || this.state.drawing.eraser)) {
            this.addToHistory();
        }
        else if (this.state.typing) {
            this.addElement(this.state.typing.textElement);
        }
        else if (this.state.selectionTransform) {
            // this.initGrid();
            // this.canvas.elements.forEach(element => {
            //   element.generateGrid(this.grid);
            // });
        }
        this.initGrid();
        this.generateGrid();
        if (this.state.drawing)
            (this.state.drawing.shape ?? this.state.drawing.line).select();
        this.state.drawing = false;
        this.state.typing = false;
        this.state.selectionTransform = false;
        this.onClickLocker = false;
    }
    onClick(event) {
        const clickedElement = this.getClickedElement(event);
        if (clickedElement) {
            if (clickedElement.selectable) {
                this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementClicked(clickedElement, event));
                if (!this.state.drawing && !this.state.typing && !this.onClickLocker) {
                    if (this.state.selectedElement) {
                        this.state.selectedElement.deselect();
                    }
                    clickedElement.select();
                    this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementSelected(clickedElement));
                    this.state.selectedElement = clickedElement;
                    this.draw();
                }
            }
        }
        else if (this.state.selectedElement) {
            this.state.selectedElement.deselect();
            this.canvas.canvas.dispatchEvent(CanvasEvents.CanvasElementDeselected(this.state.selectedElement));
            this.state.selectedElement = false;
            this.draw();
        }
    }
    changeFillColor(color) {
        this.state.variables.fillColor = color;
    }
    changeStrokeColor(color) {
        this.state.variables.strokeColor = color;
    }
    changeStrokeWidth(width) {
        this.state.variables.strokeWidth = width;
    }
    changeFont(font) {
        this.state.variables.font = font;
    }
    changeToolType(type) {
        this.state.variables.toolType = type;
    }
    toJSON() {
        return {
            timestamp: Date.now(),
            data: {
                elements: this.elements.map(element => element.toJSON())
            }
        };
    }
    load(json) {
        this.canvas.elements = json.data.elements.map(shape => {
            if (shape.type === 'Rectangle') {
                return Rectangle.fromJSON(shape);
            }
            else if (shape.type === 'Ellipse') {
                return Ellipse.fromJSON(shape);
            }
            else if (shape.type === 'Triangle') {
                return Triangle.fromJSON(shape);
            }
            else if (shape.type.match(/Polygon\[\d+]/)) {
                return Polygon.fromJSON(shape);
            }
            else if (shape.type === 'Line') {
                return Line.fromJSON(shape);
            }
            else if (shape.type === 'Text') {
                return CanvasText.fromJSON(shape);
            }
            return Shape.fromJSON(shape);
        });
        this.draw();
    }
    clear() {
        this.canvas.elements = [];
        this.draw();
        this.addToHistory();
        this.generateGrid();
    }
    toDataURL() {
        this.elements.forEach((element) => {
            element.deselect();
        });
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, 999999, 999999);
        this.draw(false);
        return this.canvas.canvas.toDataURL();
    }
    savePNG(name) {
        this.toDataURL();
        const aDownloadLink = document.createElement('a');
        aDownloadLink.download = name ?? 'canvas.png';
        aDownloadLink.href = this.toDataURL();
        aDownloadLink.click();
    }
    savePDF(name) {
        this.canvas.elements.forEach((element) => element.deselect());
        this.draw();
        // @ts-ignore
        const doc = new jspdf.jsPDF(this.canvas.canvas.width > this.canvas.canvas.height ? 'landscape' : 'portrait', 'px', [this.canvas.canvas.width, this.canvas.canvas.height]);
        const image = this.toDataURL();
        doc.addImage(image, 'JPEG', 0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        doc.save(name ?? 'canvas.pdf');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGFkcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9Db2xsYWRyYXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0seUJBQXlCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxTQUFTLE1BQU0sNkJBQTZCLENBQUM7QUFFcEQsT0FBTyxPQUFPLE1BQU0sMkJBQTJCLENBQUM7QUFDaEQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFFbEQsT0FBTyxnQkFBZ0IsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLFFBQVEsTUFBTSxrQkFBa0IsQ0FBQztBQUV4QyxPQUFPLE9BQU8sTUFBTSwyQkFBMkIsQ0FBQztBQUNoRCxPQUFPLFlBQWtDLE1BQU0sdUJBQXVCLENBQUM7QUFFdkUsT0FBTyxVQUFVLE1BQU0sOEJBQThCLENBQUM7QUFDdEQsT0FBTyxJQUFJLE1BQU0sd0JBQXdCLENBQUM7QUFDMUMsT0FBTyxlQUFlLE1BQU0seUJBQXlCLENBQUM7QUFFdEQsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFTO0lBQzVCLE1BQU0sQ0FHSjtJQUNGLE9BQU8sQ0FBMkI7SUFDbEMsSUFBSSxDQUFhO0lBQ2pCLGNBQWMsR0FBVyxDQUFDLENBQUM7SUFDM0IsVUFBVSxDQUFvQjtJQUM5QixlQUFlLEdBQVcsU0FBUyxDQUFDO0lBQ3BDLGdCQUFnQixHQUFZLEtBQUssQ0FBQztJQUMxQixLQUFLLEdBQVU7UUFDckIsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxFQUFFO1NBQ1Q7S0FDRixDQUFDO0lBQ00sYUFBYSxHQUFZLEtBQUssQ0FBQztJQUV2QyxZQUFZLE1BQXlCLEVBQUUsaUJBQXlCLENBQUM7UUFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFX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UUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxlQUFlLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcs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