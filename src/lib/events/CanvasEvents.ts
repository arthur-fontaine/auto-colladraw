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

type TransformationEvent = TransformationTranslateEvent | TransformationResizeEvent;

export type AnchorPoint = 'topLeft' | 'topRight'| 'bottomLeft'| 'bottomRight'| 'left'| 'right'| 'bottom'| 'top';

export default {
  CanvasElementClicked: (element: CanvasElement, mouseevent: MouseEvent) => new CustomEvent<{ element: CanvasElement, mouseevent: MouseEvent }>('element-clicked', {
    detail: { element, mouseevent }
  }),

  CanvasElementSelected: (element: CanvasElement) => new CustomEvent<{ element: CanvasElement }>('element-selected', {
    detail: { element }
  }),

  CanvasElementDeselected: (element: CanvasElement) => new CustomEvent<{ element: CanvasElement }>('element-deselected', {
    detail: { element }
  }),

  CanvasElementMoved: (element: CanvasElement, mouseevent: MouseEvent) => new CustomEvent<{ element: CanvasElement, mouseevent: MouseEvent }>('element-moved', {
    detail: { element, mouseevent }
  }),

  CanvasElementTransformed: (element: CanvasElement, transformation: TransformationEvent) => new CustomEvent<{ element: CanvasElement, transformation: TransformationEvent }>('element-transform', {
    detail: { element, transformation }
  }),

  CanvasElementCreated: (element: CanvasElement) => new CustomEvent<{ element: CanvasElement }>('element-created', {
    detail: { element }
  }),

  CanvasAnchorPointClicked: (anchorPoint: AnchorPoint, mouseevent: MouseEvent) => new CustomEvent<{ anchorPoint: AnchorPoint, mouseevent: MouseEvent }>('anchor-point-clicked', {
    detail: { anchorPoint, mouseevent }
  }),

  CanvasAnchorPointHovered: (anchorPoint: AnchorPoint, mouseevent: MouseEvent) => new CustomEvent<{ anchorPoint: AnchorPoint, mouseevent: MouseEvent }>('anchor-point-hovered', {
    detail: { anchorPoint, mouseevent }
  }),

  CanvasAnchorPointLeave: (mouseevent: MouseEvent) => new CustomEvent<{ mouseevent: MouseEvent }>('anchor-point-leave', {
    detail: { mouseevent }
  }),
}
