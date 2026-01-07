/**

 * @description Defines the structure for calendar events.
 */

/**
 * Represents a calendar event that can be displayed on the calendar.
 * Events can span multiple days, be all-day events, or have specific times.
 *
 * @template T - Type of custom data attached to the event
 *
 * @example
 * ```typescript
 * const event: CalendarEvent = {
 *   id: 1,
 *   title: 'Team Meeting',
 *   description: 'Weekly sync',
 *   start: new Date('2026-01-15T10:00:00'),
 *   end: new Date('2026-01-15T11:00:00'),
 *   cssClass: 'event-meeting'
 * };
 *
 * // With dynamic CSS class
 * const dynamicEvent: CalendarEvent<{ priority: string }> = {
 *   id: 2,
 *   title: 'Review',
 *   start: new Date(),
 *   data: { priority: 'high' },
 *   cssClass: (e) => e.data?.priority === 'high' ? 'event-urgent' : 'event-normal'
 * };
 * ```
 */
export interface CalendarEvent<T = any> {
	/**
	 * Unique identifier for the event.
	 * Used for tracking and updating events.
	 */
	id?: number | string;

	/**
	 * Display title of the event.
	 * This is the main text shown on the calendar.
	 */
	title: string;

	/**
	 * Optional description or notes for the event.
	 * May be displayed in tooltips or detail views.
	 */
	description?: string;

	/**
	 * Start date and time of the event.
	 * Required for all events.
	 */
	start: Date;

	/**
	 * End date and time of the event.
	 * If not provided, the event is treated as a point-in-time event.
	 */
	end?: Date;

	/**
	 * Whether this is an all-day event.
	 * All-day events display at the top of day/week views.
	 * @default false
	 */
	allDay?: boolean;

	/**
	 * CSS class(es) to apply to the event element.
	 * Can be a static string or a function that returns a class based on event data.
	 *
	 * @example
	 * ```typescript
	 * // Static class
	 * cssClass: 'event-important'
	 *
	 * // Dynamic class based on event
	 * cssClass: (event) => event.data?.priority === 'high' ? 'event-urgent' : 'event-normal'
	 * ```
	 */
	cssClass?: string | ((event: CalendarEvent<T>) => string);

	/**
	 * Custom data attached to the event.
	 * Useful for storing additional properties used in custom templates.
	 */
	data?: T;
}
