export declare enum CanvasElementType {
    RECTANGLE = "rectangle",
    ELLIPSE = "ellipse",
    TRIANGLE = "triangle",
    POLYGON = "polygon",
    TEXT = "text",
    LINE = "line",
    PENCIL = "pencil",
    ERASER = "eraser"
}
export declare type ShapeType = Exclude<CanvasElementType, CanvasElementType.TEXT>;
export declare type PolygonTypeString = 'Rectangle' | 'Triangle' | `Polygon[${number}]` | 'Line';
export declare type CanvasElementTypeString = PolygonTypeString | 'Ellipse' | 'Text' | 'Pencil' | 'Eraser';
