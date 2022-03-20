import CanvasElement from "../canvas_elements/CanvasElement";
interface TransformationTranslateEvent {
    type: 'translate';
    x: number;
    y: number;
    oldX: number;
    oldY: number;
}
interface TransformationResizeEvent {
    type: 'resize';
    x: number;
    y: number;
    width: number;
    height: number;
    oldX: number;
    oldY: number;
    oldWidth: number;
    oldHeight: number;
}
declare type TransformationEvent = TransformationTranslateEvent | TransformationResizeEvent;
export declare type AnchorPoint = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'bottom' | 'top';
declare const _default: {
    CanvasElementClicked: (element: CanvasElement, mouseevent: MouseEvent) => CustomEvent<{
        element: CanvasElement;
        mouseevent: MouseEvent;
    }>;
    CanvasElementSelected: (element: CanvasElement) => CustomEvent<{
        element: CanvasElement;
    }>;
    CanvasElementDeselected: (element: CanvasElement) => CustomEvent<{
        element: CanvasElement;
    }>;
    CanvasElementMoved: (element: CanvasElement, mouseevent: MouseEvent) => CustomEvent<{
        element: CanvasElement;
        mouseevent: MouseEvent;
    }>;
    CanvasElementTransformed: (element: CanvasElement, transformation: TransformationEvent) => CustomEvent<{
        element: CanvasElement;
        transformation: TransformationEvent;
    }>;
    CanvasElementCreated: (element: CanvasElement) => CustomEvent<{
        element: CanvasElement;
    }>;
    CanvasAnchorPointClicked: (anchorPoint: AnchorPoint, mouseevent: MouseEvent) => CustomEvent<{
        anchorPoint: AnchorPoint;
        mouseevent: MouseEvent;
    }>;
    CanvasAnchorPointHovered: (anchorPoint: AnchorPoint, mouseevent: MouseEvent) => CustomEvent<{
        anchorPoint: AnchorPoint;
        mouseevent: MouseEvent;
    }>;
    CanvasAnchorPointLeave: (mouseevent: MouseEvent) => CustomEvent<{
        mouseevent: MouseEvent;
    }>;
};
export default _default;
