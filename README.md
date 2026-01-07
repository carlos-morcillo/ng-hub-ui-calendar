# ng-hub-ui-calendar

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-calendar.svg)](https://www.npmjs.com/package/ng-hub-ui-calendar)
[![license](https://img.shields.io/npm/l/ng-hub-ui-calendar.svg)](https://github.com/carlos-morcillo/ng-hub-ui-calendar/blob/main/LICENSE)

A powerful, flexible calendar component for Angular applications with multiple views, native drag-and-drop event rescheduling, custom templates, and full internationalization support.

## 🧩 Library Family `ng-hub-ui`

This library is part of the **Hub UI** ecosystem:

-   [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
-   [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
-   [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
-   [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
-   [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
-   [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar) ← You are here
-   [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
-   [**ng-hub-ui-list**](https://www.npmjs.com/package/ng-hub-ui-list)
-   [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
-   [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
-   [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
-   [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
-   [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

-   [Features](#-features)
-   [Installation](#-installation)
-   [Quick Start](#-quick-start)
-   [Examples](#-examples)
    -   [Basic Calendar](#basic-calendar)
    -   [View Types](#view-types)
    -   [Custom Templates](#custom-templates)
    -   [Drag and Drop](#drag-and-drop)
    -   [Configuration](#configuration)
    -   [Internationalization](#internationalization)
    -   [Event Handling](#event-handling)
-   [API Reference](#-api-reference)
-   [Styling](#-styling)
-   [Support & License](#-support--license)

## ✨ Features

-   **Multiple View Types**: Month, Week, Day, and Year views
-   **Native Drag & Drop**: Reschedule events by dragging to different days
-   **Custom Templates**: Full control over event and day cell rendering
-   **Internationalization**: Built-in English and Spanish, extensible for any language
-   **CSS Variables**: Complete styling customization via CSS custom properties
-   **TypeScript**: Full type definitions with CalendarViewType enum
-   **Standalone Components**: Works with modern Angular's standalone architecture
-   **Accessible**: Keyboard navigation and ARIA support
-   **Lightweight**: No external dependencies (native HTML5 drag-and-drop)

## 📦 Installation

```bash
npm install ng-hub-ui-calendar ng-hub-ui-utils
```

## 🚀 Quick Start

```typescript
import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	selector: 'app-calendar-demo',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<hub-calendar [events]="events()" [view]="view()" (eventClick)="onEventClick($event)" (dayClick)="onDayClick($event)">
		</hub-calendar>
	`
})
export class CalendarDemoComponent {
	view = signal<CalendarViewType>(CalendarViewType.MONTH);

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Team Meeting',
			start: new Date(),
			end: new Date(Date.now() + 2 * 60 * 60 * 1000)
		}
	]);

	onEventClick(event: CalendarEvent): void {
		console.log('Event clicked:', event);
	}

	onDayClick(day: CalendarDay): void {
		console.log('Day clicked:', day);
	}
}
```

## 📚 Examples

### Basic Calendar

```typescript
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
	standalone: true,
	imports: [HubCalendarComponent],
	template: `<hub-calendar [events]="events()"></hub-calendar>`
})
export class BasicCalendarComponent {
	events = signal<CalendarEvent[]>([
		{ id: '1', title: 'Meeting', start: new Date() },
		{ id: '2', title: 'Lunch', start: new Date(), allDay: true }
	]);
}
```

### View Types

```typescript
import { CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	template: `
		<hub-calendar [events]="events()" [view]="currentView()" (viewChange)="currentView.set($event)"> </hub-calendar>

		<div class="controls">
			<button (click)="currentView.set(CalendarViewType.MONTH)">Month</button>
			<button (click)="currentView.set(CalendarViewType.WEEK)">Week</button>
			<button (click)="currentView.set(CalendarViewType.DAY)">Day</button>
			<button (click)="currentView.set(CalendarViewType.YEAR)">Year</button>
		</div>
	`
})
export class ViewTypesComponent {
	CalendarViewType = CalendarViewType;
	currentView = signal<CalendarViewType>(CalendarViewType.MONTH);
}
```

### Custom Templates

```typescript
import { HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective } from 'ng-hub-ui-calendar';

@Component({
	standalone: true,
	imports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective],
	template: `
		<hub-calendar [events]="events()">
			<!-- Custom Event Template -->
			<ng-template eventTpt let-event="event">
				<div class="custom-event" [class.important]="event.data?.important">
					<span class="icon">{{ event.data?.important ? '⭐' : '📅' }}</span>
					<span>{{ event.title }}</span>
				</div>
			</ng-template>

			<!-- Custom Day Cell Template -->
			<ng-template dayCellTpt let-day="day">
				<div class="custom-day">
					<span class="day-number">{{ day.date | date : 'd' }}</span>
					@if (day.events.length > 0) {
					<span class="badge">{{ day.events.length }}</span>
					}
				</div>
			</ng-template>
		</hub-calendar>
	`
})
export class CustomTemplatesComponent {
	events = signal<CalendarEvent<{ important: boolean }>>([
		{ id: '1', title: 'VIP Meeting', start: new Date(), data: { important: true } },
		{ id: '2', title: 'Regular Task', start: new Date(), data: { important: false } }
	]);
}
```

### Drag and Drop

```typescript
@Component({
	template: `
		<hub-calendar [events]="events()" [config]="{ dragAndDropEnabled: true }" (eventDrop)="onEventDrop($event)">
		</hub-calendar>
	`
})
export class DragDropComponent {
	events = signal<CalendarEvent[]>([{ id: '1', title: 'Movable Event', start: new Date() }]);

	onEventDrop(event: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
		console.log(`Moved "${event.event.title}" from ${event.previousDate} to ${event.newDate}`);

		// Update the event in your data
		this.events.update((events) => events.map((e) => (e.id === event.event.id ? { ...e, start: event.newDate } : e)));
	}
}
```

### Configuration

```typescript
import { CalendarConfig, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	template: ` <hub-calendar [events]="events()" [config]="calendarConfig" [weekStartsOn]="1"> </hub-calendar> `
})
export class ConfigurationComponent {
	calendarConfig: CalendarConfig = {
		initialView: CalendarViewType.WEEK,
		weekStartsOn: 1, // Monday
		showWeekNumbers: true,
		dayStartHour: 8,
		dayEndHour: 18,
		slotDuration: 30,
		availableViews: [CalendarViewType.MONTH, CalendarViewType.WEEK, CalendarViewType.DAY],
		dragAndDropEnabled: true,
		eventCreationEnabled: true
	};
}
```

### Internationalization

```typescript
// Using built-in translations
@Component({
	template: ` <hub-calendar [events]="events()" [locale]="'es'"> </hub-calendar> `
})
export class I18nComponent {}

// With HubTranslationService
// Add calendar translations to your i18n files:
// {
//   "calendar": {
//     "weekdays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//     "months": ["January", "February", ...],
//     "today": "Today",
//     "previous": "Previous",
//     "next": "Next"
//   }
// }
```

### Event Handling

```typescript
@Component({
	template: `
		<hub-calendar
			[events]="events()"
			[(view)]="currentView"
			[(selectedDate)]="selectedDate"
			(eventClick)="onEventClick($event)"
			(dayClick)="onDayClick($event)"
			(eventDrop)="onEventDrop($event)"
			(viewChange)="onViewChange($event)"
			(dateChange)="onDateChange($event)"
		>
		</hub-calendar>
	`
})
export class EventHandlingComponent {
	currentView = signal<CalendarViewType>(CalendarViewType.MONTH);
	selectedDate = signal<Date>(new Date());

	onEventClick(event: CalendarEvent): void {
		// Open event details modal
	}

	onDayClick(day: CalendarDay): void {
		// Create new event on this day
	}

	onEventDrop(data: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
		// Update event date in backend
	}

	onViewChange(view: CalendarViewType): void {
		// Track view analytics
	}

	onDateChange(date: Date): void {
		// Load events for new date range
	}
}
```

## 📖 API Reference

### Inputs

| Input          | Type                 | Default      | Description                              |
| -------------- | -------------------- | ------------ | ---------------------------------------- |
| `events`       | `CalendarEvent[]`    | `[]`         | Events to display on the calendar        |
| `view`         | `CalendarViewType`   | `MONTH`      | Current view type (two-way bindable)     |
| `selectedDate` | `Date`               | `new Date()` | Selected/focused date (two-way bindable) |
| `config`       | `CalendarConfig`     | `{}`         | Configuration options                    |
| `eventClass`   | `string \| Function` | -            | CSS class(es) for events                 |
| `weekStartsOn` | `0-6`                | `0`          | Day week starts on (0=Sunday)            |
| `locale`       | `string`             | `'en'`       | Language code for translations           |

### Outputs

| Output       | Type                               | Description                              |
| ------------ | ---------------------------------- | ---------------------------------------- |
| `eventClick` | `CalendarEvent`                    | Emitted when an event is clicked         |
| `dayClick`   | `CalendarDay`                      | Emitted when a day cell is clicked       |
| `eventDrop`  | `{ event, newDate, previousDate }` | Emitted when an event is dropped         |
| `viewChange` | `CalendarViewType`                 | Emitted when view type changes           |
| `dateChange` | `Date`                             | Emitted when navigation changes the date |

### Interfaces

```typescript
interface CalendarEvent<T = any> {
	id?: number | string;
	title: string;
	description?: string;
	start: Date;
	end?: Date;
	allDay?: boolean;
	cssClass?: string | ((event: CalendarEvent<T>) => string);
	data?: T;
}

interface CalendarDay<T = any> {
	date: Date;
	events: CalendarEvent<T>[];
	isToday: boolean;
	isCurrentMonth: boolean;
	isWeekend: boolean;
	isSelected?: boolean;
}

enum CalendarViewType {
	MONTH = 'month',
	WEEK = 'week',
	DAY = 'day',
	YEAR = 'year'
}

interface CalendarConfig {
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
```

## 🎨 Styling

### CSS Variables

All styling can be customized via CSS variables:

```css
hub-calendar {
	/* Container */
	--hub-calendar-bg: #ffffff;
	--hub-calendar-color: #1f2937;
	--hub-calendar-border-color: #e5e7eb;
	--hub-calendar-border-radius: 0.5rem;
	--hub-calendar-font-family: system-ui, -apple-system, sans-serif;

	/* Header */
	--hub-calendar-header-bg: #f9fafb;
	--hub-calendar-header-padding: 1rem;

	/* Buttons */
	--hub-calendar-btn-bg: #ffffff;
	--hub-calendar-btn-color: inherit;
	--hub-calendar-btn-border-color: #e5e7eb;
	--hub-calendar-btn-border-radius: 0.375rem;
	--hub-calendar-btn-hover-bg: #f3f4f6;
	--hub-calendar-btn-active-bg: #3b82f6;
	--hub-calendar-btn-active-color: #ffffff;

	/* Day cells */
	--hub-calendar-day-padding: 0.5rem;
	--hub-calendar-day-min-height: 80px;
	--hub-calendar-day-hover-bg: #f3f4f6;
	--hub-calendar-day-today-bg: #eff6ff;
	--hub-calendar-day-other-month-bg: #f9fafb;
	--hub-calendar-day-other-month-color: #9ca3af;
	--hub-calendar-day-weekend-bg: #fafafa;
	--hub-calendar-day-selected-bg: #dbeafe;
	--hub-calendar-day-drag-over-bg: #bfdbfe;

	/* Events */
	--hub-calendar-event-bg: #3b82f6;
	--hub-calendar-event-color: #ffffff;
	--hub-calendar-event-border-radius: 0.25rem;
	--hub-calendar-event-font-size: 0.75rem;

	/* Month cards (year view) */
	--hub-calendar-month-card-bg: #f9fafb;
	--hub-calendar-month-card-hover-bg: #f3f4f6;
	--hub-calendar-month-card-padding: 1.5rem;

	/* Colors */
	--hub-calendar-primary: #3b82f6;
	--hub-calendar-muted: #6b7280;
}
```

### CSS Classes

| Class                             | Description                |
| --------------------------------- | -------------------------- |
| `.hub-calendar`                   | Root container             |
| `.hub-calendar__header`           | Top header with navigation |
| `.hub-calendar__day`              | Day cell container         |
| `.hub-calendar__day--today`       | Today's date styling       |
| `.hub-calendar__day--selected`    | Selected day styling       |
| `.hub-calendar__day--weekend`     | Weekend day styling        |
| `.hub-calendar__day--other-month` | Days from adjacent months  |
| `.hub-calendar__event`            | Event element              |
| `.hub-calendar__month-card`       | Month card in year view    |

## 📞 Support & License

-   **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui-calendar/issues)
-   **Author**: Carlos Morcillo
-   **License**: MIT

---

Made with ❤️ by the Hub UI team
