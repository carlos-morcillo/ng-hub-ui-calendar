import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component, computed, contentChild, input, model, output, signal, TemplateRef } from '@angular/core';

import { DayCellTemplateDirective } from '../../directives/day-cell-template.directive';
import { EventTemplateDirective } from '../../directives/event-template.directive';
import { CALENDAR_I18N } from '../../i18n/calendar-i18n';
import { CalendarDay, CalendarWeek } from '../../models/calendar-day';
import { CalendarEvent } from '../../models/calendar-event';
import { CalendarConfig, CalendarViewType, DEFAULT_CALENDAR_CONFIG } from '../../models/calendar-view';

/**
 * Main calendar component supporting month, week, day, and year views.
 */
@Component({
	selector: 'hub-calendar',
	standalone: true,
	imports: [DragDropModule, DatePipe, NgTemplateOutlet, TitleCasePipe],
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})
export class HubCalendarComponent<T = any> {
	/** Language code for i18n. Defaults to 'en'. */
	readonly locale = input<string>('en');

	// Inputs
	readonly events = input<CalendarEvent<T>[]>([]);
	readonly view = model<CalendarViewType>('month');
	readonly selectedDate = model<Date>(new Date());
	readonly config = input<CalendarConfig>({});
	readonly eventClass = input<string | ((event: CalendarEvent<T>) => string)>();
	readonly weekStartsOn = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

	// Outputs
	readonly eventClick = output<CalendarEvent<T>>();
	readonly dayClick = output<CalendarDay<T>>();
	readonly eventDrop = output<{ event: CalendarEvent<T>; newDate: Date; previousDate: Date }>();
	readonly viewChange = output<CalendarViewType>();
	readonly dateChange = output<Date>();

	// Content children for templates
	readonly eventTemplate = contentChild(EventTemplateDirective, { read: TemplateRef });
	readonly dayCellTemplate = contentChild(DayCellTemplateDirective, { read: TemplateRef });

	readonly today = signal(new Date());

	// Merged config
	readonly mergedConfig = computed(() => ({
		...DEFAULT_CALENDAR_CONFIG,
		...this.config()
	}));

	// Weekday labels
	readonly weekdayLabels = computed(() => {
		const i18n = this.getTranslation('weekdays') || CALENDAR_I18N['en']['weekdays'];
		const start = this.weekStartsOn();
		return [...i18n.slice(start), ...i18n.slice(0, start)];
	});

	// Current month name
	readonly currentMonthName = computed(() => {
		const months = this.getTranslation('months') || CALENDAR_I18N['en']['months'];
		return months[this.selectedDate().getMonth()];
	});

	// Current year
	readonly currentYear = computed(() => this.selectedDate().getFullYear());

	// Weeks for month view
	readonly weeks = computed<CalendarWeek<T>[]>(() => this.generateMonthWeeks());

	// Days for week view
	readonly weekDays = computed<CalendarDay<T>[]>(() => this.generateWeekDays());

	// Current day for day view
	readonly currentDay = computed<CalendarDay<T>>(() => this.generateDayView());

	// Months for year view
	readonly months = computed(() => this.generateYearMonths());

	// Hours for day/week view
	readonly hours = computed(() => {
		const config = this.mergedConfig();
		const hours: number[] = [];
		for (let h = config.dayStartHour; h < config.dayEndHour; h++) {
			hours.push(h);
		}
		return hours;
	});

	goToToday(): void {
		this.selectedDate.set(new Date());
		this.dateChange.emit(this.selectedDate());
	}

	previous(): void {
		const current = this.selectedDate();
		const newDate = new Date(current);
		switch (this.view()) {
			case 'month':
				newDate.setMonth(newDate.getMonth() - 1);
				break;
			case 'week':
				newDate.setDate(newDate.getDate() - 7);
				break;
			case 'day':
				newDate.setDate(newDate.getDate() - 1);
				break;
			case 'year':
				newDate.setFullYear(newDate.getFullYear() - 1);
				break;
		}
		this.selectedDate.set(newDate);
		this.dateChange.emit(newDate);
	}

	next(): void {
		const current = this.selectedDate();
		const newDate = new Date(current);
		switch (this.view()) {
			case 'month':
				newDate.setMonth(newDate.getMonth() + 1);
				break;
			case 'week':
				newDate.setDate(newDate.getDate() + 7);
				break;
			case 'day':
				newDate.setDate(newDate.getDate() + 1);
				break;
			case 'year':
				newDate.setFullYear(newDate.getFullYear() + 1);
				break;
		}
		this.selectedDate.set(newDate);
		this.dateChange.emit(newDate);
	}

	setView(view: CalendarViewType): void {
		this.view.set(view);
		this.viewChange.emit(view);
	}

	onEventClick(event: CalendarEvent<T>, e: MouseEvent): void {
		e.stopPropagation();
		this.eventClick.emit(event);
	}

	onDayClick(day: CalendarDay<T>): void {
		this.selectedDate.set(day.date);
		this.dayClick.emit(day);
	}

	onEventDrop(dropEvent: CdkDragDrop<CalendarDay<T>>): void {
		const event = dropEvent.item.data as CalendarEvent<T>;
		const previousDate = new Date(event.start);
		const newDate = dropEvent.container.data.date;

		this.eventDrop.emit({ event, newDate, previousDate });
	}

	onMonthClick(monthDate: Date): void {
		this.selectedDate.set(monthDate);
		this.setView('month');
	}

	getEventClass(event: CalendarEvent<T>): string {
		const eventClassInput = this.eventClass();
		if (typeof eventClassInput === 'function') {
			return eventClassInput(event);
		}
		if (eventClassInput) {
			return eventClassInput;
		}
		if (typeof event.cssClass === 'function') {
			return event.cssClass(event);
		}
		return event.cssClass || '';
	}

	private getTranslation(key: string): any {
		const lang = this.locale();
		const translations = CALENDAR_I18N[lang] || CALENDAR_I18N['en'];
		return translations[key];
	}

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

	private getEventsForDate(date: Date): CalendarEvent<T>[] {
		return this.events().filter((event) => {
			const eventStart = this.startOfDay(new Date(event.start));
			const eventEnd = event.end ? this.endOfDay(new Date(event.end)) : eventStart;
			const checkDate = this.startOfDay(new Date(date));
			return checkDate >= eventStart && checkDate <= eventEnd;
		});
	}

	private isSameDay(d1: Date, d2: Date): boolean {
		return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
	}

	private startOfDay(date: Date): Date {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	}

	private endOfDay(date: Date): Date {
		const d = new Date(date);
		d.setHours(23, 59, 59, 999);
		return d;
	}
}
