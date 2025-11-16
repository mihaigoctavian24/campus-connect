/**
 * Tests for Cancellation Validation
 */

import {
  validateCancellationDeadline,
  getCancellationDeadline,
  isPastCancellationDeadline,
  getTimeUntilCancellationDeadline,
  assertCancellationAllowed,
  CANCELLATION_DEADLINE_HOURS,
} from '../cancellation-validation';

describe('Cancellation Validation - validateCancellationDeadline', () => {
  const eventStart = new Date('2024-11-20T10:00:00');

  it('should allow cancellation 25 hours before event', () => {
    const cancellationTime = new Date('2024-11-19T09:00:00'); // 25 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(true);
    expect(result.hoursUntilEvent).toBe(25);
    expect(result.requiresContactProfessor).toBe(false);
    expect(result.message).toContain('Cancellation allowed');
  });

  it('should allow cancellation exactly 24 hours before event', () => {
    const cancellationTime = new Date('2024-11-19T10:00:00'); // Exactly 24 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(true);
    expect(result.hoursUntilEvent).toBe(24);
    expect(result.requiresContactProfessor).toBe(false);
  });

  it('should allow cancellation 48 hours before event', () => {
    const cancellationTime = new Date('2024-11-18T10:00:00'); // 48 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(true);
    expect(result.hoursUntilEvent).toBe(48);
    expect(result.requiresContactProfessor).toBe(false);
  });

  it('should reject cancellation 23 hours before event', () => {
    const cancellationTime = new Date('2024-11-19T11:00:00'); // 23 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(false);
    expect(result.hoursUntilEvent).toBe(23);
    expect(result.requiresContactProfessor).toBe(true);
    expect(result.message).toContain('Cannot cancel within 24h');
    expect(result.message).toContain('Please contact professor');
  });

  it('should reject cancellation 12 hours before event', () => {
    const cancellationTime = new Date('2024-11-19T22:00:00'); // 12 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(false);
    expect(result.requiresContactProfessor).toBe(true);
  });

  it('should reject cancellation 1 hour before event', () => {
    const cancellationTime = new Date('2024-11-20T09:00:00'); // 1 hour before
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(false);
    expect(result.requiresContactProfessor).toBe(true);
  });

  it('should reject cancellation after event has started', () => {
    const cancellationTime = new Date('2024-11-20T11:00:00'); // 1 hour after start
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.canCancel).toBe(false);
    expect(result.requiresContactProfessor).toBe(true);
  });

  it('should return correct deadline date', () => {
    const cancellationTime = new Date('2024-11-19T09:00:00');
    const result = validateCancellationDeadline(eventStart, cancellationTime);

    expect(result.deadline).toEqual(new Date('2024-11-19T10:00:00')); // 24h before event
  });

  it('should use current time as default cancellation time', () => {
    const result = validateCancellationDeadline(eventStart);

    expect(typeof result.canCancel).toBe('boolean');
    expect(typeof result.hoursUntilEvent).toBe('number');
  });

  it('should support custom deadline hours', () => {
    const cancellationTime = new Date('2024-11-19T22:00:00'); // 12 hours before
    const result = validateCancellationDeadline(eventStart, cancellationTime, 12); // 12-hour deadline

    expect(result.canCancel).toBe(true); // Should be allowed with 12-hour deadline
  });
});

describe('Cancellation Validation - getCancellationDeadline', () => {
  const eventStart = new Date('2024-11-20T10:00:00');

  it('should return correct deadline for 24-hour policy', () => {
    const deadline = getCancellationDeadline(eventStart);

    expect(deadline).toEqual(new Date('2024-11-19T10:00:00'));
  });

  it('should support custom deadline hours', () => {
    const deadline = getCancellationDeadline(eventStart, 48);

    expect(deadline).toEqual(new Date('2024-11-18T10:00:00')); // 48 hours before
  });

  it('should handle midnight events correctly', () => {
    const midnightEvent = new Date('2024-11-20T00:00:00');
    const deadline = getCancellationDeadline(midnightEvent);

    expect(deadline).toEqual(new Date('2024-11-19T00:00:00'));
  });
});

describe('Cancellation Validation - isPastCancellationDeadline', () => {
  it('should return false for events far in future', () => {
    const futureEvent = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now
    const isPast = isPastCancellationDeadline(futureEvent);

    expect(isPast).toBe(false);
  });

  it('should return true for events starting soon', () => {
    const soonEvent = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
    const isPast = isPastCancellationDeadline(soonEvent);

    expect(isPast).toBe(true);
  });

  it('should return true for past events', () => {
    const pastEvent = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const isPast = isPastCancellationDeadline(pastEvent);

    expect(isPast).toBe(true);
  });
});

describe('Cancellation Validation - getTimeUntilCancellationDeadline', () => {
  it('should return correct time remaining for future deadline', () => {
    const futureEvent = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now
    const timeInfo = getTimeUntilCancellationDeadline(futureEvent);

    expect(timeInfo.isPastDeadline).toBe(false);
    expect(timeInfo.remainingHours).toBeGreaterThan(0);
    expect(timeInfo.message).toContain('until deadline');
  });

  it('should indicate past deadline for imminent events', () => {
    const soonEvent = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
    const timeInfo = getTimeUntilCancellationDeadline(soonEvent);

    expect(timeInfo.isPastDeadline).toBe(true);
    expect(timeInfo.message).toContain('deadline passed');
  });

  it('should return correct deadline date', () => {
    const futureEvent = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const timeInfo = getTimeUntilCancellationDeadline(futureEvent);

    expect(timeInfo.deadline).toBeInstanceOf(Date);
  });
});

describe('Cancellation Validation - assertCancellationAllowed', () => {
  it('should not throw for events far in future', () => {
    const futureEvent = new Date(Date.now() + 48 * 60 * 60 * 1000);

    expect(() => {
      assertCancellationAllowed(futureEvent);
    }).not.toThrow();
  });

  it('should throw for events starting soon', () => {
    const soonEvent = new Date(Date.now() + 12 * 60 * 60 * 1000);

    expect(() => {
      assertCancellationAllowed(soonEvent);
    }).toThrow('Cannot cancel within 24h');
  });

  it('should throw with correct message', () => {
    const soonEvent = new Date(Date.now() + 12 * 60 * 60 * 1000);

    expect(() => {
      assertCancellationAllowed(soonEvent);
    }).toThrow('Please contact professor');
  });
});

describe('Cancellation Validation - Configuration', () => {
  it('should have correct default deadline hours', () => {
    expect(CANCELLATION_DEADLINE_HOURS).toBe(24);
  });
});
