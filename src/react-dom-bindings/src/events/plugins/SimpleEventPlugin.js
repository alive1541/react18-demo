import {
  registerSimpleEvents,
  topLevelEventsToReactNames,
} from "../DOMEventProperties";
import { accumulateSinglePhaseListeners } from "../DOMPluginEventSystem";
import { IS_CAPTURE_PHASE } from "../EventSystemFlags";
import { SyntheticMouseEvent } from "../SyntheticEvent";

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags
) {
  const reactName = topLevelEventsToReactNames(domEventName);
  let SyntheticEventCtor;
  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    default:
      break;
  }
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase
  );
  if (listeners.length > 0) {
    const event = new SyntheticEventCtor(
      reactName,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({ event, listeners });
  }
}

export { registerSimpleEvents as registerEvents, extractEvents };
