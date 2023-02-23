import {
  HostRoot,
  HostComponent,
  HostText,
  FunctionComponent,
  IndeterminateComponent,
} from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import logger, { indent } from "shared/logger";
import { renderWithHooks } from "./ReactFiberHooks";

function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function mountIndeterminateComponent(_current, workInProgress, Component) {
  const props = workInProgress.pendingProps;
  const value = renderWithHooks(null, workInProgress, Component, props);
  workInProgress.tag = FunctionComponent;
  reconcileChildren(null, workInProgress, value);
  return workInProgress.child;
}

function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps
) {
  const nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps
  );
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type
      );
    case FunctionComponent: {
      const Component = workInProgress.type;
      const resolveProps = workInProgress.pendingProps;
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolveProps
      );
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
    default:
      return null;
  }
}
