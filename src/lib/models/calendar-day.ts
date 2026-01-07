import { CalendarEvent } from './calendar-event';

/**
 * Represents a single day cell in the calendar.
 */
export interface CalendarDay<T = any> {
	date: Date;
	events: CalendarEvent<T>[];
	isToday: boolean;
	isCurrentMonth: boolean;
	isWeekend: boolean;
	isSelected?: boolean;
}

/**
 * Represents a week row in the calendar.
 */
export interface CalendarWeek<T = any> {
	days: CalendarDay<T>[];
	weekNumber?: number;
}

/**
 * Represents a month in the year view.
 */
export interface CalendarMonth {
	date: Date;
	name: string;
	shortName: string;
	eventCount: number;
}
