/**

 * @description Main calendar component supporting month, week, day, and year views.
 * Features native HTML5 drag-and-drop, custom templates, and i18n support.
 */

import { DatePipe, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import {
	afterNextRender,
	Component,
	computed,
	contentChild,
	ElementRef,
	inject,
	Injector,
	input,
	model,
	output,
	signal,
	TemplateRef
} from '@angular/core';
import { HubOverflowTooltipDirective, HubTranslationService } from 'ng-hub-ui-utils';

import { DayCellTemplateDirective } from '../../directives/day-cell-template.directive';
import { EventTemplateDirective } from '../../directives/event-template.directive';
import { CALENDAR_I18N } from '../../i18n/calendar-i18n';
import { CalendarDay, CalendarWeek } from '../../models/calendar-day';
import { CalendarEvent } from '../../models/calendar-event';
import { CalendarConfig, CalendarViewType, DEFAULT_CALENDAR_CONFIG } from '../../models/calendar-view';

/**
 * Main calendar component supporting month, week, day, and year views.
 *
 * Features:
 * - Multiple view types: month, week, day, year
 * - Native HTML5 drag-and-drop for event rescheduling (pointer-only)
 * - WAI-ARIA grid semantics and full keyboard navigation in month view
 *   (roving tabindex, arrows, Home/End, PageUp/PageDown, Enter/Space)
 * - Custom templates for events and day cells
 * - Internationalization support via HubTranslationService
 * - CSS variables for complete styling customization
 *
 * @example Basic usage
 * ```html
 * <hub-calendar
 *   [events]="events()"
 *   [view]="CalendarViewType.MONTH"
 *   (eventClick)="onEventClick($event)"
 *   (dayClick)="onDayClick($event)">
 * </hub-calendar>
 * ```
 *
 * @example With custom event template
 * ```html
 * <hub-calendar [events]="events()">
 *   <ng-template eventTpt let-event="event">
 *     <div class="custom-event">
 *       <span>{{ event.title }}</span>
 *     </div>
 *   </ng-template>
 * </hub-calendar>
 * ```
 */
/** Variants with exact design-system token coverage via the SCSS `@each` loop. */
const CALENDAR_BUILT_IN_VARIANTS = new Set<string>(['primary', 'success', 'danger', 'warning', 'info']);

@Component({
	selector: 'hub-calendar',
	standalone: true,
	imports: [DatePipe, NgTemplateOutlet, TitleCasePipe, HubOverflowTooltipDirective],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
	host: {
		class: 'hub-calendar',
		'[attr.data-variant]': 'variant() ?? null',
		'[style.--hub-calendar-accent]': 'customAccent()'
	}
})
export class HubCalendarComponent<T = any> {
	/**
	 * Translation service injected for i18n support.
	 * Falls back to built-in translations if not available.
	 */
	private readonly translationSvc = inject(HubTranslationService, { optional: true });

	/**
	 * Host element reference. Used to scope DOM queries (drag-over cleanup,
	 * roving-tabindex focus restoration) to this calendar instance, which also
	 * keeps them SSR-safe (no global `document` access).
	 */
	private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/**
	 * Injector handed to `afterNextRender` when restoring keyboard focus after
	 * the month grid re-renders.
	 */
	private readonly injector = inject(Injector);

	// =========================================================================
	// INPUTS
	// =========================================================================

	/**
	 * Semantic accent of the calendar: `'primary'` · `'success'` · `'danger'` ·
	 * `'warning'` · `'info'`, or any custom string (read as `--hub-sys-color-<variant>`).
	 * Re-bases `--hub-calendar-accent`, which drives the today / selected day, the
	 * active view button and the event chips. Defaults to primary.
	 */
	readonly variant = input<string>();

	/**
	 * Inline accent for custom (non-built-in) variants — the built-in five are
	 * resolved by the SCSS `@each` loop, so this returns `null` for them.
	 */
	protected readonly customAccent = computed(() => {
		const v = this.variant();
		return v && !CALENDAR_BUILT_IN_VARIANTS.has(v) ? `var(--hub-sys-color-${v})` : null;
	});

	/**
	 * Events to display on the calendar.
	 * Events are filtered and distributed to the appropriate day cells.
	 */
	readonly events = input<CalendarEvent<T>[]>([]);

	/**
	 * Current view type.
	 * Can be bound two-way using [(view)].
	 * @default CalendarViewType.MONTH
	 */
	readonly view = model<CalendarViewType>(CalendarViewType.MONTH);

	/**
	 * Currently selected/focused date.
	 * Controls which month/week/day is displayed.
	 * Can be bound two-way using [(selectedDate)].
	 */
	readonly selectedDate = model<Date>(new Date());

	/**
	 * Configuration options for the calendar.
	 * Merged with DEFAULT_CALENDAR_CONFIG.
	 */
	readonly config = input<CalendarConfig>({});

	/**
	 * CSS class(es) to apply to all events.
	 * Can be a static string or a function for dynamic classes.
	 */
	readonly eventClass = input<string | ((event: CalendarEvent<T>) => string)>();

	/**
	 * Day the week starts on (0 = Sunday, 1 = Monday, etc.).
	 * Overrides config.weekStartsOn if provided.
	 * @default 0
	 */
	readonly weekStartsOn = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

	/**
	 * Language code for i18n.
	 * Falls back to 'en' if the language is not available.
	 * @default 'en'
	 */
	readonly locale = input<string>('en');

	// =========================================================================
	// OUTPUTS
	// =========================================================================

	/**
	 * Emitted when an event is clicked.
	 * Provides the full event object.
	 */
	readonly eventClick = output<CalendarEvent<T>>();

	/**
	 * Emitted when a day cell is clicked.
	 * Provides the day object with date and events.
	 */
	readonly dayClick = output<CalendarDay<T>>();

	/**
	 * Emitted when an event is dropped on a different day (drag and drop).
	 * Provides the event, new date, and previous date.
	 */
	readonly eventDrop = output<{ event: CalendarEvent<T>; newDate: Date; previousDate: Date }>();

	/**
	 * Emitted when navigation changes the displayed date.
	 */
	readonly dateChange = output<Date>();

	// =========================================================================
	// TEMPLATE REFERENCES
	// =========================================================================

	/**
	 * Custom template for rendering events.
	 * Use with [eventTpt] directive.
	 */
	readonly eventTemplate = contentChild(EventTemplateDirective, { read: TemplateRef });

	/**
	 * Custom template for rendering day cells.
	 * Use with [dayCellTpt] directive.
	 */
	readonly dayCellTemplate = contentChild(DayCellTemplateDirective, { read: TemplateRef });

	// =========================================================================
	// STATE
	// =========================================================================

	/**
	 * Current date (today) for highlighting.
	 */
	readonly today = signal(new Date());

	/**
	 * Currently dragged event during drag operation.
	 * @internal
	 */
	private draggedEvent: CalendarEvent<T> | null = null;

	// =========================================================================
	// COMPUTED PROPERTIES
	// =========================================================================

	/**
	 * Merged configuration with defaults.
	 * User config overrides default values.
	 */
	readonly mergedConfig = computed(() => ({
		...DEFAULT_CALENDAR_CONFIG,
		...this.config()
	}));

	/**
	 * Weekday labels based on weekStartsOn setting.
	 * Rotated to start from the configured first day.
	 */
	readonly weekdayLabels = computed(() => {
		const i18n = this.getTranslation('weekdays') || CALENDAR_I18N['en']['weekdays'];
		const start = this.weekStartsOn();
		return [...i18n.slice(start), ...i18n.slice(0, start)];
	});

	/**
	 * Full weekday names for accessible column-header labels.
	 * Rotated to the configured first day of the week, mirroring `weekdayLabels`.
	 */
	readonly weekdayFullLabels = computed(() => {
		const i18n = this.getTranslation('weekdaysFull') || CALENDAR_I18N['en']['weekdaysFull'];
		const start = this.weekStartsOn();
		return [...i18n.slice(start), ...i18n.slice(0, start)];
	});

	/**
	 * Current month name for header display.
	 * Localized based on locale setting.
	 */
	readonly currentMonthName = computed(() => {
		const months = this.getTranslation('months') || CALENDAR_I18N['en']['months'];
		return months[this.selectedDate().getMonth()];
	});

	/**
	 * Current year for header display.
	 */
	readonly currentYear = computed(() => this.selectedDate().getFullYear());

	/**
	 * Accessible name of the month-view grid: the visible month and year
	 * (e.g. "July 2026"), localized like the header title.
	 */
	readonly monthGridLabel = computed(() => `${this.currentMonthName()} ${this.currentYear()}`);

	/**
	 * Localized labels for the icon-only previous/next navigation buttons.
	 */
	readonly navLabels = computed(() => ({
		previous: (this.getTranslation('previous') as string) || CALENDAR_I18N['en']['previous'],
		next: (this.getTranslation('next') as string) || CALENDAR_I18N['en']['next']
	}));

	/**
	 * Weeks array for month view.
	 * Each week contains 7 day objects.
	 */
	readonly weeks = computed<CalendarWeek<T>[]>(() => this.generateMonthWeeks());

	/**
	 * Days array for week view.
	 * Contains 7 day objects for the current week.
	 */
	readonly weekDays = computed<CalendarDay<T>[]>(() => this.generateWeekDays());

	/**
	 * Current day object for day view.
	 */
	readonly currentDay = computed<CalendarDay<T>>(() => this.generateDayView());

	/**
	 * Months array for year view.
	 * Contains 12 month objects with event counts.
	 */
	readonly months = computed(() => this.generateYearMonths());

	/**
	 * Hours array for day/week time slots.
	 * Based on dayStartHour and dayEndHour config.
	 */
	readonly hours = computed(() => {
		const config = this.mergedConfig();
		const hours: number[] = [];
		for (let h = config.dayStartHour; h < config.dayEndHour; h++) {
			hours.push(h);
		}
		return hours;
	});

	// =========================================================================
	// PUBLIC METHODS - NAVIGATION
	// =========================================================================

	/**
	 * Navigates the calendar to today's date.
	 * Resets the selectedDate to the current date.
	 */
	goToToday(): void {
		this.selectedDate.set(new Date());
		this.dateChange.emit(this.selectedDate());
	}

	/**
	 * Navigates to the previous period based on current view.
	 * - Month: Goes to previous month
	 * - Week: Goes to previous week
	 * - Day: Goes to previous day
	 * - Year: Goes to previous year
	 */
	previous(): void {
		const current = this.selectedDate();
		const newDate = new Date(current);

		switch (this.view()) {
			case CalendarViewType.MONTH:
				newDate.setMonth(newDate.getMonth() - 1);
				break;
			case CalendarViewType.WEEK:
				newDate.setDate(newDate.getDate() - 7);
				break;
			case CalendarViewType.DAY:
				newDate.setDate(newDate.getDate() - 1);
				break;
			case CalendarViewType.YEAR:
				newDate.setFullYear(newDate.getFullYear() - 1);
				break;
		}

		this.selectedDate.set(newDate);
		this.dateChange.emit(newDate);
	}

	/**
	 * Navigates to the next period based on current view.
	 * - Month: Goes to next month
	 * - Week: Goes to next week
	 * - Day: Goes to next day
	 * - Year: Goes to next year
	 */
	next(): void {
		const current = this.selectedDate();
		const newDate = new Date(current);

		switch (this.view()) {
			case CalendarViewType.MONTH:
				newDate.setMonth(newDate.getMonth() + 1);
				break;
			case CalendarViewType.WEEK:
				newDate.setDate(newDate.getDate() + 7);
				break;
			case CalendarViewType.DAY:
				newDate.setDate(newDate.getDate() + 1);
				break;
			case CalendarViewType.YEAR:
				newDate.setFullYear(newDate.getFullYear() + 1);
				break;
		}

		this.selectedDate.set(newDate);
		this.dateChange.emit(newDate);
	}

	/**
	 * Changes the current calendar view.
	 * @param view - The view type to switch to
	 */
	setView(view: CalendarViewType): void {
		this.view.set(view);
	}

	// =========================================================================
	// PUBLIC METHODS - EVENT HANDLERS
	// =========================================================================

	/**
	 * Handles click on an event element.
	 * Stops propagation to prevent triggering day click.
	 * @param event - The clicked event
	 * @param e - The mouse event
	 */
	onEventClick(event: CalendarEvent<T>, e: MouseEvent): void {
		e.stopPropagation();
		this.eventClick.emit(event);
	}

	/**
	 * Handles click on a day cell.
	 * Updates selectedDate and emits dayClick event.
	 * @param day - The clicked day object
	 */
	onDayClick(day: CalendarDay<T>): void {
		this.selectedDate.set(day.date);
		this.dayClick.emit(day);
	}

	/**
	 * Handles click on a month card in year view.
	 * Navigates to that month in month view.
	 * @param monthDate - The date of the clicked month
	 */
	onMonthClick(monthDate: Date): void {
		this.selectedDate.set(monthDate);
		this.setView(CalendarViewType.MONTH);
	}

	// =========================================================================
	// PUBLIC METHODS - ACCESSIBILITY
	// =========================================================================

	/**
	 * Builds the accessible full-date label of a day cell,
	 * e.g. "Wednesday, July 15, 2026", localized via the calendar i18n.
	 * @param day - The day to describe
	 * @returns Localized full-date string
	 */
	getDayAriaLabel(day: CalendarDay<T>): string {
		const weekdays = this.getTranslation('weekdaysFull') || CALENDAR_I18N['en']['weekdaysFull'];
		const months = this.getTranslation('months') || CALENDAR_I18N['en']['months'];
		const date = day.date;
		return `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}

	/**
	 * Builds the accessible label of a year-view month card, appending the
	 * event count when the month has events (mirrors the visible card text).
	 * @param month - The month summary to describe
	 * @returns Month label (e.g. "January 2026, 3 events")
	 */
	getMonthAriaLabel(month: { date: Date; name: string; eventCount: number }): string {
		const base = `${month.name} ${month.date.getFullYear()}`;
		return month.eventCount > 0 ? `${base}, ${month.eventCount} events` : base;
	}

	// =========================================================================
	// PUBLIC METHODS - KEYBOARD NAVIGATION
	// =========================================================================

	/**
	 * Keyboard handler for month-view day cells, implementing the WAI-ARIA grid
	 * navigation model with a roving tabindex. The selected day is the single
	 * tabbable cell, so selection follows keyboard focus (matching the existing
	 * header navigation, where previous/next also move `selectedDate`):
	 * - Arrow keys move by one day (left/right) or one week (up/down)
	 * - Home/End jump to the start/end of the focused week
	 * - PageUp/PageDown move to the same day in the previous/next month
	 * - Enter/Space activate the day (same behavior as clicking it)
	 *
	 * Crossing a month boundary re-renders the grid on the new month, emits
	 * `dateChange` (mirroring the header previous/next buttons) and restores
	 * DOM focus on the target cell after the re-render.
	 * @param e - The keyboard event
	 * @param day - The day cell that received the key
	 */
	onGridKeydown(e: KeyboardEvent, day: CalendarDay<T>): void {
		// Ignore keys bubbling up from interactive children (e.g. event chips).
		if (e.target !== e.currentTarget) {
			return;
		}

		let target: Date | null = null;

		switch (e.key) {
			case 'ArrowLeft':
				target = this.addDays(day.date, -1);
				break;
			case 'ArrowRight':
				target = this.addDays(day.date, 1);
				break;
			case 'ArrowUp':
				target = this.addDays(day.date, -7);
				break;
			case 'ArrowDown':
				target = this.addDays(day.date, 7);
				break;
			case 'Home':
				target = this.startOfWeek(day.date);
				break;
			case 'End':
				target = this.addDays(this.startOfWeek(day.date), 6);
				break;
			case 'PageUp':
				target = this.addMonths(day.date, -1);
				break;
			case 'PageDown':
				target = this.addMonths(day.date, 1);
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				this.onDayClick(day);
				return;
			default:
				return;
		}

		e.preventDefault();
		this.moveFocusTo(target);
	}

	/**
	 * Keyboard handler for event chips: Enter/Space emit `eventClick`,
	 * mirroring the chip's click behavior. Propagation stops so the
	 * containing day cell is not activated as well.
	 * @param event - The calendar event represented by the chip
	 * @param e - The keyboard event
	 */
	onEventKeydown(event: CalendarEvent<T>, e: KeyboardEvent): void {
		if (e.key !== 'Enter' && e.key !== ' ') {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.eventClick.emit(event);
	}

	/**
	 * Keyboard handler for year-view month cards: Enter/Space open the month
	 * in month view, mirroring the card's click behavior.
	 * @param monthDate - The first day of the represented month
	 * @param e - The keyboard event
	 */
	onMonthKeydown(monthDate: Date, e: KeyboardEvent): void {
		if (e.key !== 'Enter' && e.key !== ' ') {
			return;
		}

		e.preventDefault();
		this.onMonthClick(monthDate);
	}

	// =========================================================================
	// PUBLIC METHODS - DRAG AND DROP (Native HTML5)
	// =========================================================================

	/**
	 * Handles the dragstart event when an event starts being dragged.
	 * @param event - The calendar event being dragged
	 * @param e - The drag event
	 */
	onDragStart(event: CalendarEvent<T>, e: DragEvent): void {
		if (!this.mergedConfig().dragAndDropEnabled) {
			e.preventDefault();
			return;
		}

		this.draggedEvent = event;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', JSON.stringify(event));
		}
	}

	/**
	 * Handles the dragover event on a day cell.
	 * Must call preventDefault to allow dropping.
	 * @param e - The drag event
	 */
	onDragOver(e: DragEvent): void {
		if (this.draggedEvent) {
			e.preventDefault();
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = 'move';
			}
		}
	}

	/**
	 * Handles the dragenter event on a day cell.
	 * Adds visual feedback for the drop target.
	 * @param e - The drag event
	 */
	onDragEnter(e: DragEvent): void {
		if (this.draggedEvent) {
			const target = e.currentTarget as HTMLElement;
			target.classList.add('hub-calendar__day--drag-over');
		}
	}

	/**
	 * Handles the dragleave event on a day cell.
	 * Removes visual feedback when leaving the drop target.
	 * @param e - The drag event
	 */
	onDragLeave(e: DragEvent): void {
		const target = e.currentTarget as HTMLElement;
		target.classList.remove('hub-calendar__day--drag-over');
	}

	/**
	 * Handles the drop event when an event is dropped on a day.
	 * Emits the eventDrop event with the event and new date.
	 * @param day - The day where the event was dropped
	 * @param e - The drag event
	 */
	onDrop(day: CalendarDay<T>, e: DragEvent): void {
		e.preventDefault();

		const target = e.currentTarget as HTMLElement;
		target.classList.remove('hub-calendar__day--drag-over');

		if (this.draggedEvent) {
			const previousDate = new Date(this.draggedEvent.start);
			const newDate = new Date(day.date);

			this.eventDrop.emit({
				event: this.draggedEvent,
				newDate,
				previousDate
			});

			this.draggedEvent = null;
		}
	}

	/**
	 * Handles the dragend event when dragging ends.
	 * Cleans up the dragged event state.
	 * @param e - The drag event
	 */
	onDragEnd(e: DragEvent): void {
		this.draggedEvent = null;

		// Remove any lingering drag-over classes. Scoped to this calendar's host
		// element (instead of the global `document`) so it is SSR-safe and never
		// touches other calendar instances on the page.
		const dropZones = this.elementRef.nativeElement.querySelectorAll('.hub-calendar__day--drag-over');
		dropZones.forEach((zone) => zone.classList.remove('hub-calendar__day--drag-over'));
	}

	// =========================================================================
	// PUBLIC METHODS - STYLING
	// =========================================================================

	/**
	 * Gets the CSS class(es) for an event.
	 * Resolves both eventClass input and event-specific cssClass.
	 * @param event - The event to get classes for
	 * @returns Space-separated class string
	 */
	getEventClass(event: CalendarEvent<T>): string {
		const classes: string[] = [];

		// Apply input eventClass
		const eventClassInput = this.eventClass();
		if (typeof eventClassInput === 'function') {
			classes.push(eventClassInput(event));
		} else if (eventClassInput) {
			classes.push(eventClassInput);
		}

		// Apply event-specific cssClass
		if (typeof event.cssClass === 'function') {
			classes.push(event.cssClass(event));
		} else if (event.cssClass) {
			classes.push(event.cssClass);
		}

		return classes.filter(Boolean).join(' ');
	}

	// =========================================================================
	// PRIVATE METHODS - TRANSLATION
	// =========================================================================

	/**
	 * Gets a translation for the given key.
	 * Uses HubTranslationService if available, falls back to CALENDAR_I18N.
	 * @param key - The translation key (e.g., 'weekdays', 'months')
	 * @returns The translated value
	 */
	private getTranslation(key: string): any {
		if (this.translationSvc) {
			const translated = this.translationSvc.getTranslation(`calendar.${key}`);
			// Check if translation exists (not just the key returned back)
			if (translated !== undefined && translated !== `calendar.${key}`) {
				return translated;
			}
		}

		const lang = this.locale();
		const translations = CALENDAR_I18N[lang] || CALENDAR_I18N['en'];
		return translations[key];
	}

	// =========================================================================
	// PRIVATE METHODS - DATA GENERATION
	// =========================================================================

	/**
	 * Generates the weeks array for month view.
	 * Creates 6 rows of 7 days each, including days from adjacent months.
	 * @returns Array of CalendarWeek objects
	 */
	private generateMonthWeeks(): CalendarWeek<T>[] {
		const date = this.selectedDate();
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startOffset = (firstDay.getDay() - this.weekStartsOn() + 7) % 7;
		const weeks: CalendarWeek<T>[] = [];

		let currentDate = new Date(firstDay);
		currentDate.setDate(currentDate.getDate() - startOffset);

		while (currentDate <= lastDay || weeks.length < 6) {
			const week: CalendarDay<T>[] = [];

			for (let i = 0; i < 7; i++) {
				const dayDate = new Date(currentDate);
				week.push({
					date: dayDate,
					events: this.getEventsForDate(dayDate),
					isToday: this.isSameDay(dayDate, this.today()),
					isCurrentMonth: dayDate.getMonth() === month,
					isWeekend: dayDate.getDay() === 0 || dayDate.getDay() === 6,
					isSelected: this.isSameDay(dayDate, this.selectedDate())
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			weeks.push({ days: week });
			if (weeks.length >= 6) break;
		}

		return weeks;
	}

	/**
	 * Generates the days array for week view.
	 * Creates 7 consecutive days starting from the week start day.
	 * @returns Array of CalendarDay objects
	 */
	private generateWeekDays(): CalendarDay<T>[] {
		const date = this.selectedDate();
		const start = new Date(date);
		const dayOffset = (start.getDay() - this.weekStartsOn() + 7) % 7;
		start.setDate(start.getDate() - dayOffset);

		const days: CalendarDay<T>[] = [];

		for (let i = 0; i < 7; i++) {
			const dayDate = new Date(start);
			dayDate.setDate(start.getDate() + i);
			days.push({
				date: dayDate,
				events: this.getEventsForDate(dayDate),
				isToday: this.isSameDay(dayDate, this.today()),
				isCurrentMonth: true,
				isWeekend: dayDate.getDay() === 0 || dayDate.getDay() === 6,
				isSelected: this.isSameDay(dayDate, this.selectedDate())
			});
		}

		return days;
	}

	/**
	 * Generates the day object for day view.
	 * @returns CalendarDay object for the selected date
	 */
	private generateDayView(): CalendarDay<T> {
		const date = this.selectedDate();
		return {
			date,
			events: this.getEventsForDate(date),
			isToday: this.isSameDay(date, this.today()),
			isCurrentMonth: true,
			isWeekend: date.getDay() === 0 || date.getDay() === 6,
			isSelected: true
		};
	}

	/**
	 * Generates the months array for year view.
	 * Creates 12 month objects with event counts.
	 * @returns Array of month summary objects
	 */
	private generateYearMonths(): { date: Date; name: string; eventCount: number }[] {
		const year = this.selectedDate().getFullYear();
		const months = this.getTranslation('months') || CALENDAR_I18N['en']['months'];
		const result: { date: Date; name: string; eventCount: number }[] = [];

		for (let m = 0; m < 12; m++) {
			const monthDate = new Date(year, m, 1);
			const monthEnd = new Date(year, m + 1, 0);
			const eventCount = this.events().filter((e) => {
				const eventDate = new Date(e.start);
				return eventDate >= monthDate && eventDate <= monthEnd;
			}).length;

			result.push({
				date: monthDate,
				name: months[m],
				eventCount
			});
		}

		return result;
	}

	// =========================================================================
	// PRIVATE METHODS - UTILITIES
	// =========================================================================

	/**
	 * Gets all events that occur on a specific date.
	 * Handles both single-day and multi-day events.
	 * @param date - The date to filter events for
	 * @returns Array of events occurring on that date
	 */
	private getEventsForDate(date: Date): CalendarEvent<T>[] {
		return this.events().filter((event) => {
			const eventStart = this.startOfDay(new Date(event.start));
			const eventEnd = event.end ? this.endOfDay(new Date(event.end)) : eventStart;
			const checkDate = this.startOfDay(new Date(date));
			return checkDate >= eventStart && checkDate <= eventEnd;
		});
	}

	/**
	 * Returns a new date offset by the given number of days.
	 * @param date - The reference date (not mutated)
	 * @param days - Number of days to add (may be negative)
	 * @returns The offset date
	 */
	private addDays(date: Date, days: number): Date {
		const d = new Date(date);
		d.setDate(d.getDate() + days);
		return d;
	}

	/**
	 * Returns the same day-of-month in another month, clamped to the target
	 * month's last day (e.g. Jan 31 + 1 month resolves to Feb 28/29).
	 * @param date - The reference date (not mutated)
	 * @param months - Number of months to add (may be negative)
	 * @returns The offset date
	 */
	private addMonths(date: Date, months: number): Date {
		const d = new Date(date);
		const day = d.getDate();
		d.setDate(1);
		d.setMonth(d.getMonth() + months);
		const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
		d.setDate(Math.min(day, lastDay));
		return d;
	}

	/**
	 * Returns the first day of the week containing the given date,
	 * honoring the `weekStartsOn` input.
	 * @param date - The reference date (not mutated)
	 * @returns The first day of that week
	 */
	private startOfWeek(date: Date): Date {
		const d = new Date(date);
		const offset = (d.getDay() - this.weekStartsOn() + 7) % 7;
		d.setDate(d.getDate() - offset);
		return d;
	}

	/**
	 * Moves the keyboard focus — and the selection, which follows it — to the
	 * given date. Emits `dateChange` when the visible month changes (mirroring
	 * the header previous/next buttons) and restores DOM focus on the target
	 * cell after the grid re-renders.
	 * @param target - The date to focus
	 */
	private moveFocusTo(target: Date): void {
		const current = this.selectedDate();
		const monthChanged = target.getMonth() !== current.getMonth() || target.getFullYear() !== current.getFullYear();

		this.selectedDate.set(target);

		if (monthChanged) {
			this.dateChange.emit(target);
		}

		this.focusSelectedDayCell();
	}

	/**
	 * Focuses the single tabbable day cell (the roving-tabindex stop) after the
	 * next render, so keyboard focus survives grid re-renders and month changes.
	 * `afterNextRender` never runs on the server, keeping this SSR-safe.
	 */
	private focusSelectedDayCell(): void {
		afterNextRender(
			() => {
				this.elementRef.nativeElement.querySelector<HTMLElement>('.hub-calendar__day[tabindex="0"]')?.focus();
			},
			{ injector: this.injector }
		);
	}

	/**
	 * Checks if two dates are the same day.
	 * Ignores time portion.
	 * @param d1 - First date
	 * @param d2 - Second date
	 * @returns True if same day
	 */
	private isSameDay(d1: Date, d2: Date): boolean {
		return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
	}

	/**
	 * Gets the start of a day (midnight).
	 * @param date - The date to normalize
	 * @returns Date set to 00:00:00.000
	 */
	private startOfDay(date: Date): Date {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	}

	/**
	 * Gets the end of a day (23:59:59.999).
	 * @param date - The date to normalize
	 * @returns Date set to 23:59:59.999
	 */
	private endOfDay(date: Date): Date {
		const d = new Date(date);
		d.setHours(23, 59, 59, 999);
		return d;
	}
}
