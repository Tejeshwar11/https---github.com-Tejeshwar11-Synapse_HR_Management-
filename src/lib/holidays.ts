import type { Holiday } from './types';

// Approximate dates are used for floating holidays like Holi, Memorial Day, Diwali, and Thanksgiving.
// These are illustrative and may not be exact for each year.
export const HOLIDAYS: Holiday[] = [
  // 2023
  { date: '2023-01-01', name: "New Year's Day" },
  { date: '2023-01-26', name: 'Republic Day (India)' },
  { date: '2023-03-08', name: 'Holi (India)' },
  { date: '2023-05-29', name: 'Memorial Day (US)' },
  { date: '2023-06-19', name: 'Juneteenth (US)' },
  { date: '2023-07-04', name: 'Independence Day (US)' },
  { date: '2023-08-15', name: 'Independence Day (India)' },
  { date: '2023-10-02', name: 'Gandhi Jayanti (India)' },
  { date: '2023-11-12', name: 'Diwali (India)' },
  { date: '2023-11-23', name: 'Thanksgiving Day (US)' },
  { date: '2023-12-25', name: 'Christmas Day' },

  // 2024
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-01-26', name: 'Republic Day (India)' },
  { date: '2024-03-25', name: 'Holi (India)' },
  { date: '2024-05-27', name: 'Memorial Day (US)' },
  { date: '2024-06-19', name: 'Juneteenth (US)' },
  { date: '2024-07-04', name: 'Independence Day (US)' },
  { date: '2024-08-15', name: 'Independence Day (India)' },
  { date: '2024-10-02', name: 'Gandhi Jayanti (India)' },
  { date: '2024-11-01', name: 'Diwali (India)' },
  { date: '2024-11-28', name: 'Thanksgiving Day (US)' },
  { date: '2024-12-25', name: 'Christmas Day' },

  // 2025
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-26', name: 'Republic Day (India)' },
  { date: '2025-03-14', name: 'Holi (India)' },
  { date: '2025-05-26', name: 'Memorial Day (US)' },
  { date: '2025-06-19', name: 'Juneteenth (US)' },
  { date: '2025-07-04', name: 'Independence Day (US)' },
  { date: '2025-08-15', name: 'Independence Day (India)' },
  { date: '2025-10-02', name: 'Gandhi Jayanti (India)' },
  { date: '2025-11-20', name: 'Diwali (India)' },
  { date: '2025-11-27', name: 'Thanksgiving Day (US)' },
  { date: '2025-12-25', name: 'Christmas Day' },
];

export const holidayMap = new Map(HOLIDAYS.map(h => [h.date, h.name]));
