import {
  appendChild,
  insertBefore,
  commitUpdate,
  removeChild,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";
import { MutationMask, Placement, Update } from "./ReactFiberFlags";

let hostParent = null;

function commitDeletionEffects(root, returnFiber, deletedFiber) {
  let parent = returnFiber;
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent: {
        hostParent = parent.stateNode;
        break findParent;
      }
      case HostRoot: {
        hostParent = parent.stateNode.containerInfo;
        break findParent;
      }
      default:
        break;
    }
    parent = parent.return;
  }
  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
  hostParent = null;
}

function commitDeletionEffectsOnFiber(
  finishedRoot,
  nearestMountedAncestor,
  deletedFiber
) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber, stateNode);
      }
      break;
    }
    default:
      break;
  }
}

function recursivelyTraverseDeletionEffects(
  finishedRoot,
  nearestMountedAncestor,
  parent
) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

function recursivelyTraverseMutationEffects(root, parentFiber) {
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot;
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
  return parent;
}

function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostRoot;
  if (isHost) {
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    const { child } = node;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function getHostSibling(fiber) {
  let node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.flags & Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }
    if (!(node.flags & Placement)) {
      return node.stateNode;
    }
  }
}

function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostRoot:
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    default:
      break;
  }
}

function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork;
  if (flags | Placement) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
}

export function commitMutationEffectsOnFiber(finishedWork) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
    case HostComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        const instance = finishedWork.stateNode;
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload !== null) {
            commitUpdate(
              instance,
              updatePayload,
              type,
              oldProps,
              newProps,
              finishedWork
            );
          }
        }
      }
      break;
    }
    case HostText: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
    default:
      break;
  }
}
