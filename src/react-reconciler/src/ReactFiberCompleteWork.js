import logger, { indent } from "shared/logger";
import {
  appendInitialChild,
  createInstance,
  finalizeInitialChildren,
  createTextInstance,
  prepareUpdate,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";

import { NoFlags, Ref, Update } from "./ReactFiberFlags";
import {
  HostComponent,
  HostText,
  HostRoot,
  FunctionComponent,
} from "./ReactWorkTags";

function markRef(workInProgress) {
  workInProgress.flags |= Ref;
}
function bubbleProperties(completeWork) {
  let subtreeFlags = NoFlags;
  let child = completeWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completeWork.subtreeFlags |= subtreeFlags;
}

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }
    if (node === workInProgress) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node = node.sibling;
  }
}

function markUpdate(workInProgress) {
  workInProgress.flags |= Update;
}

function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps;
  const instance = workInProgress.stateNode;
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
  }
}
export function completeWork(current, workInProgress) {
  indent.number -= 2;
  logger("completeWork", workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostComponent: {
      const { type } = workInProgress;
      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent(current, workInProgress, type, newProps);
        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        const instance = createInstance(type, newProps, workInProgress);
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      bubbleProperties(workInProgress);
      break;
    }
    case FunctionComponent:
      bubbleProperties(workInProgress);
      break;
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostText:
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
      break;
    default:
      break;
  }
}
