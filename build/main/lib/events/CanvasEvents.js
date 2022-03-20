"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    CanvasElementClicked: (element, mouseevent) => new CustomEvent('element-clicked', {
        detail: { element, mouseevent }
    }),
    CanvasElementSelected: (element) => new CustomEvent('element-selected', {
        detail: { element }
    }),
    CanvasElementDeselected: (element) => new CustomEvent('element-deselected', {
        detail: { element }
    }),
    CanvasElementMoved: (element, mouseevent) => new CustomEvent('element-moved', {
        detail: { element, mouseevent }
    }),
    CanvasElementTransformed: (element, transformation) => new CustomEvent('element-transform', {
        detail: { element, transformation }
    }),
    CanvasElementCreated: (element) => new CustomEvent('element-created', {
        detail: { element }
    }),
    CanvasAnchorPointClicked: (anchorPoint, mouseevent) => new CustomEvent('anchor-point-clicked', {
        detail: { anchorPoint, mouseevent }
    }),
    CanvasAnchorPointHovered: (anchorPoint, mouseevent) => new CustomEvent('anchor-point-hovered', {
        detail: { anchorPoint, mouseevent }
    }),
    CanvasAnchorPointLeave: (mouseevent) => new CustomEvent('anchor-point-leave', {
        detail: { mouseevent }
    }),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FudmFzRXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9ldmVudHMvQ2FudmFzRXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBMEJBLGtCQUFlO0lBQ2Isb0JBQW9CLEVBQUUsQ0FBQyxPQUFzQixFQUFFLFVBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFxRCxpQkFBaUIsRUFBRTtRQUMvSixNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0tBQ2hDLENBQUM7SUFFRixxQkFBcUIsRUFBRSxDQUFDLE9BQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUE2QixrQkFBa0IsRUFBRTtRQUNqSCxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUU7S0FDcEIsQ0FBQztJQUVGLHVCQUF1QixFQUFFLENBQUMsT0FBc0IsRUFBRSxFQUFFLENBQUMsSUFBSSxXQUFXLENBQTZCLG9CQUFvQixFQUFFO1FBQ3JILE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRTtLQUNwQixDQUFDO0lBRUYsa0JBQWtCLEVBQUUsQ0FBQyxPQUFzQixFQUFFLFVBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFxRCxlQUFlLEVBQUU7UUFDM0osTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtLQUNoQyxDQUFDO0lBRUYsd0JBQXdCLEVBQUUsQ0FBQyxPQUFzQixFQUFFLGNBQW1DLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFrRSxtQkFBbUIsRUFBRTtRQUMvTCxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO0tBQ3BDLENBQUM7SUFFRixvQkFBb0IsRUFBRSxDQUFDLE9BQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUE2QixpQkFBaUIsRUFBRTtRQUMvRyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUU7S0FDcEIsQ0FBQztJQUVGLHdCQUF3QixFQUFFLENBQUMsV0FBd0IsRUFBRSxVQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBdUQsc0JBQXNCLEVBQUU7UUFDNUssTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRTtLQUNwQyxDQUFDO0lBRUYsd0JBQXdCLEVBQUUsQ0FBQyxXQUF3QixFQUFFLFVBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUF1RCxzQkFBc0IsRUFBRTtRQUM1SyxNQUFNLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFO0tBQ3BDLENBQUM7SUFFRixzQkFBc0IsRUFBRSxDQUFDLFVBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksV0FBVyxDQUE2QixvQkFBb0IsRUFBRTtRQUNwSCxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUU7S0FDdkIsQ0FBQztDQUNILENBQUEifQ==