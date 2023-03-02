import { allowConcurrentByDefault } from "shared/ReactFeatureFlags";

export const TotalLanes = 31;
export const NoLanes = 0b0000000000000000000000000000000;
export const NoLane = 0b0000000000000000000000000000000;
export const SyncLane = 0b0000000000000000000000000000001; // 1
export const InputContinuousLane = 0b0000000000000000000000000000100; // 4
export const DefaultLane = 0b0000000000000000000000000010000; // 16
export const NonIdleLanes = 0b0001111111111111111111111111111;
export const IdleLane = 0b0100000000000000000000000000000;

export function mergeLanes(a, b) {
  return a | b;
}

export function markRootUpdate(root, updateLane) {
  root.pendingLanes |= updateLane;
}

export function getNextLanes(root, wipLanes) {
  const pendingLanes = root.pendingLanes;
  if (pendingLanes === NoLanes) {
    return NoLanes;
  }
  const nextLeans = getHighestPriorityLanes(pendingLanes);
  if (wipLanes !== NoLanes && wipLanes !== nextLeans) {
    return wipLanes;
  }
  return nextLeans;
}

function getHighestPriorityLanes(lanes) {
  return getHighestPriorityLane(lanes);
}

export function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

export function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}

export function includesBlockingLane(root, lanes) {
  if (allowConcurrentByDefault) {
    return false;
  }
  const SyncDefaultLanes = InputContinuousLane | DefaultLane;
  return (lanes & SyncDefaultLanes) !== NoLanes;
}

export function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset;
}
