import * as Scheduler from "/src/scheduler";

console.log(11111, Scheduler);
export const scheduleCallback = Scheduler.unstable_scheduleCallback;
export const NormalPriority = Scheduler.unstable_NormalPriority;
export const ImmediatePriority = Scheduler.unstable_ImmediatePriority;
export const UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
export const LowPriority = Scheduler.unstable_LowPriority;
export const IdlePriority = Scheduler.unstable_IdlePriority;
