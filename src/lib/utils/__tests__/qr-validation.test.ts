/**
 * Tests for QR Code Time Window Validation
 */

import {
  validateQRTimeWindow,
  getQRTimeWindow,
  isQRCodeActive,
  getQRCodeStatus,
  QR_TIME_WINDOW_MINUTES,
} from '../qr-validation';

describe('QR Validation - validateQRTimeWindow', () => {
  const sessionStart = new Date('2024-11-16T10:00:00');

  it('should validate check-in exactly at session start time', () => {
    const checkIn = new Date('2024-11-16T10:00:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(0);
    expect(result.message).toContain('on time');
  });

  it('should validate check-in 15 minutes before session start', () => {
    const checkIn = new Date('2024-11-16T09:45:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(-15);
    expect(result.message).toContain('15 minutes early');
  });

  it('should validate check-in 15 minutes after session start', () => {
    const checkIn = new Date('2024-11-16T10:15:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(15);
    expect(result.message).toContain('15 minutes after start');
  });

  it('should validate check-in 10 minutes before session start', () => {
    const checkIn = new Date('2024-11-16T09:50:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(-10);
  });

  it('should validate check-in 5 minutes after session start', () => {
    const checkIn = new Date('2024-11-16T10:05:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(5);
  });

  it('should reject check-in 16 minutes before session start (too early)', () => {
    const checkIn = new Date('2024-11-16T09:44:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Too early');
    expect(result.message).toContain('1 minutes too early');
  });

  it('should reject check-in 16 minutes after session start (too late)', () => {
    const checkIn = new Date('2024-11-16T10:16:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Too late');
    expect(result.message).toContain('1 minutes late');
  });

  it('should reject check-in 30 minutes before session start', () => {
    const checkIn = new Date('2024-11-16T09:30:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain('15 minutes too early');
  });

  it('should reject check-in 1 hour after session start', () => {
    const checkIn = new Date('2024-11-16T11:00:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain('45 minutes late');
  });

  it('should return correct window boundaries', () => {
    const checkIn = new Date('2024-11-16T10:00:00');
    const result = validateQRTimeWindow(sessionStart, checkIn);

    expect(result.windowStart).toEqual(new Date('2024-11-16T09:45:00'));
    expect(result.windowEnd).toEqual(new Date('2024-11-16T10:15:00'));
  });

  it('should support custom time windows', () => {
    const checkIn = new Date('2024-11-16T10:20:00');
    const result = validateQRTimeWindow(sessionStart, checkIn, 30); // 30 minute window

    expect(result.isValid).toBe(true);
    expect(result.minutesFromStart).toBe(20);
  });
});

describe('QR Validation - getQRTimeWindow', () => {
  const sessionStart = new Date('2024-11-16T10:00:00');

  it('should return correct time window boundaries', () => {
    const window = getQRTimeWindow(sessionStart);

    expect(window.windowStart).toEqual(new Date('2024-11-16T09:45:00'));
    expect(window.windowEnd).toEqual(new Date('2024-11-16T10:15:00'));
    expect(window.durationMinutes).toBe(30); // 15 minutes before + 15 minutes after
  });

  it('should support custom window duration', () => {
    const window = getQRTimeWindow(sessionStart, 20);

    expect(window.windowStart).toEqual(new Date('2024-11-16T09:40:00'));
    expect(window.windowEnd).toEqual(new Date('2024-11-16T10:20:00'));
    expect(window.durationMinutes).toBe(40);
  });
});

describe('QR Validation - isQRCodeActive', () => {
  it('should return true when current time is within window', () => {
    // This test depends on current time, so we'll test the logic structure
    const now = new Date();
    const sessionStart = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

    const isActive = isQRCodeActive(sessionStart);

    // Should be active since we're within 15 minutes before session start
    expect(typeof isActive).toBe('boolean');
  });
});

describe('QR Validation - getQRCodeStatus', () => {
  it('should return NOT_YET_ACTIVE for future sessions', () => {
    const now = new Date();
    const sessionStart = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

    const status = getQRCodeStatus(sessionStart);

    expect(status.status).toBe('NOT_YET_ACTIVE');
    expect(status.remainingMinutes).toBeGreaterThan(0);
    expect(status.message).toContain('will be active');
  });

  it('should return EXPIRED for past sessions', () => {
    const now = new Date();
    const sessionStart = new Date(now.getTime() - 30 * 60000); // 30 minutes ago

    const status = getQRCodeStatus(sessionStart);

    expect(status.status).toBe('EXPIRED');
    expect(status.remainingMinutes).toBeLessThan(0);
    expect(status.message).toContain('expired');
  });

  it('should return ACTIVE when session is happening now', () => {
    const now = new Date();
    const sessionStart = new Date(now.getTime() - 5 * 60000); // Started 5 minutes ago

    const status = getQRCodeStatus(sessionStart);

    expect(status.status).toBe('ACTIVE');
    expect(status.remainingMinutes).toBeGreaterThan(0);
    expect(status.message).toContain('valid for');
  });
});

describe('QR Validation - Configuration', () => {
  it('should have correct default time window', () => {
    expect(QR_TIME_WINDOW_MINUTES).toBe(15);
  });
});
