/**
 * Available view types for the calendar.
 */
export type CalendarViewType = 'month' | 'week' | 'day' | 'year';

/**
 * Configuration options for the calendar component.
 */
export interface CalendarConfig {
	initialView?: CalendarViewType;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	showWeekNumbers?: boolean;
	dayStartHour?: number;
	dayEndHour?: number;
	slotDuration?: number;
	availableViews?: CalendarViewType[];
	dragAndDropEnabled?: boolean;
	eventCreationEnabled?: boolean;
}

/**
 * Default configuration values.
 */
export const DEFAULT_CALENDAR_CONFIG: Required<CalendarConfig> = {
	initialView: 'month',
	weekStartsOn: 0,
	showWeekNumbers: false,
	dayStartHour: 0,
	dayEndHour: 24,
	slotDuration: 60,
	availableViews: ['month', 'week', 'day', 'year'],
	dragAndDropEnabled: true,
	eventCreationEnabled: true
};
