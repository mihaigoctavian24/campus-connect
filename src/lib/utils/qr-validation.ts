/**
 * QR Code Time Window Validation Utilities
 *
 * Handles validation logic for QR code check-in time windows
 * PRD Requirement: Students can check in ±15 minutes from session start time
 */

/**
 * Time window configuration
 */
export const QR_TIME_WINDOW_MINUTES = 15;

/**
 * Validates if the check-in timestamp is within the allowed window
 * relative to the session start time
 *
 * @param sessionStartTime - The scheduled start time of the session
 * @param checkInTime - The time when the student scans the QR code
 * @param windowMinutes - The allowed time window in minutes (default: 15)
 * @returns Object with validation result and details
 *
 * @example
 * ```ts
 * const sessionStart = new Date('2024-11-16T10:00:00');
 * const checkIn = new Date('2024-11-16T10:10:00');
 *
 * const result = validateQRTimeWindow(sessionStart, checkIn);
 * // result.isValid = true
 * // result.minutesFromStart = 10
 * ```
 */
export function validateQRTimeWindow(
  sessionStartTime: Date,
  checkInTime: Date,
  windowMinutes: number = QR_TIME_WINDOW_MINUTES
): {
  isValid: boolean;
  minutesFromStart: number;
  windowStart: Date;
  windowEnd: Date;
  message: string;
} {
  const windowMilliseconds = windowMinutes * 60 * 1000;

  // Calculate the allowed time window
  const windowStart = new Date(sessionStartTime.getTime() - windowMilliseconds);
  const windowEnd = new Date(sessionStartTime.getTime() + windowMilliseconds);

  // Calculate minutes difference from session start
  const timeDifference = checkInTime.getTime() - sessionStartTime.getTime();
  const minutesFromStart = Math.round(timeDifference / 60000);

  // Check if check-in time is within the window
  const isValid = checkInTime >= windowStart && checkInTime <= windowEnd;

  // Generate appropriate message
  let message: string;
  if (isValid) {
    if (minutesFromStart < 0) {
      message = `Check-in successful (${Math.abs(minutesFromStart)} minutes early)`;
    } else if (minutesFromStart > 0) {
      message = `Check-in successful (${minutesFromStart} minutes after start)`;
    } else {
      message = 'Check-in successful (on time)';
    }
  } else {
    if (checkInTime < windowStart) {
      const tooEarlyMinutes = Math.abs(
        Math.round((windowStart.getTime() - checkInTime.getTime()) / 60000)
      );
      message = `Too early: QR code can be scanned starting ${windowMinutes} minutes before session start (${tooEarlyMinutes} minutes too early)`;
    } else {
      const tooLateMinutes = Math.round((checkInTime.getTime() - windowEnd.getTime()) / 60000);
      message = `Too late: QR code expired ${windowMinutes} minutes after session start (${tooLateMinutes} minutes late)`;
    }
  }

  return {
    isValid,
    minutesFromStart,
    windowStart,
    windowEnd,
    message,
  };
}

/**
 * Gets the valid QR code time window for a session
 *
 * @param sessionStartTime - The scheduled start time of the session
 * @param windowMinutes - The allowed time window in minutes (default: 15)
 * @returns The start and end times of the valid QR code window
 */
export function getQRTimeWindow(
  sessionStartTime: Date,
  windowMinutes: number = QR_TIME_WINDOW_MINUTES
): {
  windowStart: Date;
  windowEnd: Date;
  durationMinutes: number;
} {
  const windowMilliseconds = windowMinutes * 60 * 1000;

  return {
    windowStart: new Date(sessionStartTime.getTime() - windowMilliseconds),
    windowEnd: new Date(sessionStartTime.getTime() + windowMilliseconds),
    durationMinutes: windowMinutes * 2, // Total window duration
  };
}

/**
 * Checks if the current time is within the QR code validity window
 *
 * @param sessionStartTime - The scheduled start time of the session
 * @param windowMinutes - The allowed time window in minutes (default: 15)
 * @returns True if the current time is within the valid window
 */
export function isQRCodeActive(
  sessionStartTime: Date,
  windowMinutes: number = QR_TIME_WINDOW_MINUTES
): boolean {
  const now = new Date();
  const { windowStart, windowEnd } = getQRTimeWindow(sessionStartTime, windowMinutes);

  return now >= windowStart && now <= windowEnd;
}

/**
 * Gets the remaining time until the QR code becomes active or expires
 *
 * @param sessionStartTime - The scheduled start time of the session
 * @param windowMinutes - The allowed time window in minutes (default: 15)
 * @returns Object with status and remaining minutes
 */
export function getQRCodeStatus(
  sessionStartTime: Date,
  windowMinutes: number = QR_TIME_WINDOW_MINUTES
): {
  status: 'NOT_YET_ACTIVE' | 'ACTIVE' | 'EXPIRED';
  remainingMinutes: number;
  message: string;
} {
  const now = new Date();
  const { windowStart, windowEnd } = getQRTimeWindow(sessionStartTime, windowMinutes);

  if (now < windowStart) {
    const remainingMinutes = Math.ceil((windowStart.getTime() - now.getTime()) / 60000);
    return {
      status: 'NOT_YET_ACTIVE',
      remainingMinutes,
      message: `QR code will be active in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`,
    };
  }

  if (now > windowEnd) {
    const expiredMinutes = Math.floor((now.getTime() - windowEnd.getTime()) / 60000);
    return {
      status: 'EXPIRED',
      remainingMinutes: -expiredMinutes,
      message: `QR code expired ${expiredMinutes} minute${expiredMinutes > 1 ? 's' : ''} ago`,
    };
  }

  const remainingMinutes = Math.ceil((windowEnd.getTime() - now.getTime()) / 60000);
  return {
    status: 'ACTIVE',
    remainingMinutes,
    message: `QR code valid for ${remainingMinutes} more minute${remainingMinutes > 1 ? 's' : ''}`,
  };
}
