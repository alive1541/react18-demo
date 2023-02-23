import { getClosestInstanceFromNode } from "../client/ReactDOMComponentTree";
import { dispatchEventForPluginEventSystem } from "./DOMPluginEventSystem";
import getEventTarget from "./getEventTarget";

export function createEventListenerWrapperWithPriority(
  targetContainer,
  domEventName,
  eventSystemFlags
) {
  const listenerWrapper = dispatchDiscreteEvent;
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
}

function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent
) {
  dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
}

function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const targetInst = getClosestInstanceFromNode(nativeEventTarget);
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  );
}
