import { frameYieldMs } from "scheduler/SchedulerFeatureFlags";
import { peek, pop, push } from "scheduler/SchedulerMinHeap";
import {
  IdlePriority,
  ImmediatePriority,
  LowPriority,
  NormalPriority,
  UserBlockingPriority,
} from "scheduler/SchedulerPriorities";

const maxSigned31BitInt = 1073741823;
const IMMEDIATE_PRIORITY_TIMEOUT = -1;
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
const NORMAL_PRIORITY_TIMEOUT = 5000;
const LOW_PRIORITY_TIMEOUT = 10000;
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

const taskQueue = [];
let taskIdCounter = 1;
let scheduledHostCallback = null;
let startTime = -1;
let currentTask = null;
const frameInterval = frameYieldMs;
const channel = new MessageChannel();
const port = channel.port2;

const getCurrentTime = () => performance.now();
channel.port1.onmessage = performWorkUntilDeadline;

function schedulePerformWorkUntilDeadline() {
  port.postMessage(null);
}

function performWorkUntilDeadline() {
  if (scheduledHostCallback !== null) {
    startTime = getCurrentTime();
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(startTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        scheduledHostCallback = null;
      }
    }
  }
}

function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  schedulePerformWorkUntilDeadline();
}

function unstable_scheduleCallback(priorityLevel, callback) {
  const currentTime = getCurrentTime();
  const startTime = currentTime;
  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }
  const expirationTime = startTime + timeout;

  const newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };
  newTask.sortIndex = expirationTime;
  push(taskQueue, newTask);
  requestHostCallback(flushWork);
  return newTask;
}

function flushWork(initialTime) {
  return workLoop(initialTime);
}

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    return false;
  }
  return true;
}

function workLoop(initialTime) {
  let currentTime = initialTime;
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
        return true;
      }
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue);
      }
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  if (currentTask !== null) {
    return true;
  }
  return false;
}

export { NormalPriority as unstable_NormalPriority, unstable_scheduleCallback };
