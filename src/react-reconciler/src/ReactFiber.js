import { NoFlags } from "./ReactFiberFlags";
import {
  HostRoot,
  IndeterminateComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;

  this.return = null;
  this.child = null;
  this.sibling = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.alternate = null;

  this.index = 0;
}

function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  return workInProgress;
}

export function createFiberFromTypeAndProps(type, key, pendingProps) {
  let fiberTag = IndeterminateComponent;
  if (typeof type === "string") {
    fiberTag = HostComponent;
  }
  const fiber = createFiber(fiberTag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromElement(element) {
  const { type, key } = element;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps);
  return fiber;
}

export function createFiberFromText(content) {
  const fiber = createFiber(HostText, content, null);
  return fiber;
}
