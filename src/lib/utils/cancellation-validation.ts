/**
 * Cancellation Validation Utilities
 *
 * Handles validation logic for enrollment and session cancellations
 * PRD Requirement: Cannot cancel within 24 hours of event start
 */

/**
 * Minimum hours before event start to allow cancellation
 */
export const CANCELLATION_DEADLINE_HOURS = 24;

/**
 * Validates if cancellation is allowed based on time until event start
 *
 * @param eventStartTime - The scheduled start time of the event/session
 * @param cancellationTime - The time when cancellation is attempted (default: now)
 * @param deadlineHours - Hours before event start (default: 24)
 * @returns Object with validation result and details
 *
 * @example
 * ```ts
 * const sessionStart = new Date('2024-11-20T10:00:00');
 * const result = validateCancellationDeadline(sessionStart);
 *
 * if (!result.canCancel) {
 *   throw new Error(result.message);
 * }
 * ```
 */
export function validateCancellationDeadline(
  eventStartTime: Date,
  cancellationTime: Date = new Date(),
  deadlineHours: number = CANCELLATION_DEADLINE_HOURS
): {
  canCancel: boolean;
  hoursUntilEvent: number;
  deadline: Date;
  message: string;
  requiresContactProfessor: boolean;
} {
  const deadlineMilliseconds = deadlineHours * 60 * 60 * 1000;

  // Calculate the deadline (24 hours before event start)
  const deadline = new Date(eventStartTime.getTime() - deadlineMilliseconds);

  // Calculate hours until event
  const timeDifference = eventStartTime.getTime() - cancellationTime.getTime();
  const hoursUntilEvent = timeDifference / (60 * 60 * 1000);

  // Check if cancellation is allowed
  const canCancel = cancellationTime <= deadline;

  // Generate appropriate message
  let message: string;
  const requiresContactProfessor = !canCancel;

  if (canCancel) {
    const hoursRemaining = Math.floor(hoursUntilEvent);
    message = `Cancellation allowed (${hoursRemaining} hours until event start)`;
  } else {
    const hoursLate = Math.abs(Math.floor(hoursUntilEvent - deadlineHours));
    message = `Cannot cancel within ${deadlineHours}h of event start. Please contact professor. (${hoursLate}h past deadline)`;
  }

  return {
    canCancel,
    hoursUntilEvent,
    deadline,
    message,
    requiresContactProfessor,
  };
}

/**
 * Gets the cancellation deadline for an event
 *
 * @param eventStartTime - The scheduled start time of the event
 * @param deadlineHours - Hours before event start (default: 24)
 * @returns The deadline date/time for cancellation
 */
export function getCancellationDeadline(
  eventStartTime: Date,
  deadlineHours: number = CANCELLATION_DEADLINE_HOURS
): Date {
  const deadlineMilliseconds = deadlineHours * 60 * 60 * 1000;
  return new Date(eventStartTime.getTime() - deadlineMilliseconds);
}

/**
 * Checks if the current time is past the cancellation deadline
 *
 * @param eventStartTime - The scheduled start time of the event
 * @param deadlineHours - Hours before event start (default: 24)
 * @returns True if past deadline (cancellation not allowed)
 */
export function isPastCancellationDeadline(
  eventStartTime: Date,
  deadlineHours: number = CANCELLATION_DEADLINE_HOURS
): boolean {
  const now = new Date();
  const deadline = getCancellationDeadline(eventStartTime, deadlineHours);
  return now > deadline;
}

/**
 * Gets the time remaining until cancellation deadline
 *
 * @param eventStartTime - The scheduled start time of the event
 * @param deadlineHours - Hours before event start (default: 24)
 * @returns Object with remaining time information
 */
export function getTimeUntilCancellationDeadline(
  eventStartTime: Date,
  deadlineHours: number = CANCELLATION_DEADLINE_HOURS
): {
  deadline: Date;
  remainingHours: number;
  remainingMinutes: number;
  isPastDeadline: boolean;
  message: string;
} {
  const now = new Date();
  const deadline = getCancellationDeadline(eventStartTime, deadlineHours);

  const timeDifference = deadline.getTime() - now.getTime();
  const remainingHours = timeDifference / (60 * 60 * 1000);
  const remainingMinutes = timeDifference / (60 * 1000);
  const isPastDeadline = timeDifference < 0;

  let message: string;
  if (isPastDeadline) {
    const hoursPast = Math.abs(Math.floor(remainingHours));
    message = `Cancellation deadline passed ${hoursPast} hour${hoursPast !== 1 ? 's' : ''} ago`;
  } else {
    const hoursRemaining = Math.floor(remainingHours);
    const minutesRemaining = Math.floor(remainingMinutes % 60);

    if (hoursRemaining > 0) {
      message = `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''} until deadline`;
    } else {
      message = `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''} until deadline`;
    }
  }

  return {
    deadline,
    remainingHours,
    remainingMinutes,
    isPastDeadline,
    message,
  };
}

/**
 * Validates cancellation with custom error handling
 *
 * @param eventStartTime - The scheduled start time of the event
 * @throws Error if cancellation is not allowed
 */
export function assertCancellationAllowed(eventStartTime: Date): void {
  const validation = validateCancellationDeadline(eventStartTime);

  if (!validation.canCancel) {
    throw new Error(validation.message);
  }
}
