import type { Period } from './cnfCheckerLogic';

/**
 * Calculates the notification period (deadline) based on the accounting period end date
 * @param endDate The end date of the accounting period
 * @returns The deadline date (6 months after period end)
 */
export function calculateDeadline(endDate: string): string {
  const date = new Date(endDate);
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Determines if a CNF is required based on the accounting period start date
 * @param startDate The start date of the accounting period
 * @returns Boolean indicating if CNF is required based on start date
 */
export function isCnfRequiredByStartDate(startDate: string): boolean {
  return new Date(startDate) >= new Date('2023-04-01');
}

/**
 * Gets timeline information for a claim period
 * @param period The accounting period
 * @returns Timeline information including key dates and periods
 */
export function getTimelineInfo(period: Period) {
  const cnfRequirementDate = new Date('2023-04-01');
  const periodStart = new Date(period.start);
  const periodEnd = new Date(period.end);
  
  // Calculate notification period end (deadline)
  const notificationEnd = new Date(period.end);
  notificationEnd.setMonth(notificationEnd.getMonth() + 6);
  
  return {
    accountingPeriod: {
      start: period.start,
      end: period.end
    },
    notificationPeriod: {
      start: period.end,
      end: notificationEnd.toISOString().split('T')[0]
    },
    cnfRequirementDate: '2023-04-01',
    isCnfRequiredByStartDate: periodStart >= cnfRequirementDate
  };
}