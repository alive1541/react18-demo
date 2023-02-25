import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber, requestUpdateLane } from "./ReactFiberWorkLoop";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

export function updateContainer(element, container) {
  const current = container.current;
  const lane = requestUpdateLane(current);
  const update = createUpdate(lane);
  update.payload = { element };
  const root = enqueueUpdate(current, update, lane);
  scheduleUpdateOnFiber(root, current, lane);
}
