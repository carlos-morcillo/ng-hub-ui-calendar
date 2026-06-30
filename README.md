# ng-hub-ui-calendar

[Español](./README.es.md) | **English**

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-calendar.svg)](https://www.npmjs.com/package/ng-hub-ui-calendar)
[![license](https://img.shields.io/npm/l/ng-hub-ui-calendar.svg)](https://github.com/carlos-morcillo/ng-hub-ui-calendar/blob/main/LICENSE)

> **⚠️ CRITICAL (MAJOR RELEASE):** Version 21.0.0 introduces architectural breaking changes via an SCSS refactor prefixing internal variables to standard (`--hub-calendar-*`). Please read the [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) file before upgrading.

A powerful, flexible calendar component for Angular applications with multiple views, native drag-and-drop event rescheduling, custom templates, and full internationalization support.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/calendar/overview/
- Live examples: https://hubui.dev/calendar/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **Hub UI** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar) ← You are here
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

- [ng-hub-ui-calendar](#ng-hub-ui-calendar)
    - [🧩 Library Family `ng-hub-ui`](#-library-family-ng-hub-ui)
    - [📑 Table of Contents](#-table-of-contents)
    - [✨ Features](#-features)
    - [📦 Installation](#-installation)
    - [🚀 Quick Start](#-quick-start)
    - [📚 Examples](#-examples)
        - [Basic Calendar](#basic-calendar)
        - [View Types](#view-types)
        - [Custom Templates](#custom-templates)
        - [Drag and Drop](#drag-and-drop)
        - [Configuration](#configuration)
        - [Internationalization](#internationalization)
        - [Event Handling](#event-handling)
    - [📖 API Reference](#-api-reference)
        - [Inputs](#inputs)
        - [Outputs](#outputs)
        - [Interfaces](#interfaces)
    - [🎨 Styling](#-styling)
    - [📞 Support \& License](#-support--license)

## ✨ Features

- **Multiple View Types**: Month, Week, Day, and Year views
- **Native Drag & Drop**: Reschedule events by dragging to different days
- **Custom Templates**: Full control over event and day cell rendering
- **Internationalization**: Built-in English and Spanish, extensible for any language
- **CSS Variables**: Complete styling customization via CSS custom properties
- **TypeScript**: Full type definitions with CalendarViewType enum
- **Standalone Components**: Works with modern Angular's standalone architecture
- **Accessible**: Keyboard navigation and ARIA support
- **Overflow tooltip**: events that clip their title with an ellipsis reveal the full text on hover (hub-ui tooltip by default, swappable with `provideHubTooltip`; requires `ng-hub-ui-utils >= 22.6.0` + `@use 'ng-hub-ui-utils/styles/tooltip';`)
- **Lightweight**: No external dependencies (native HTML5 drag-and-drop)

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
					<span class="day-number">{{ day.date | date: 'd' }}</span>
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
| `variant`      | `string`             | `'primary'`  | Semantic accent: `primary` / `success` / `danger` / `warning` / `info`, or any `--hub-sys-color-*` name |

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

Full CSS variable catalog:

- [`./docs/css-variables-reference.md`](./docs/css-variables-reference.md)

### Semantic Accent

The `variant` input re-bases a single accent token, `--hub-calendar-accent`, which drives the today / selected day, the active view button and the event chips. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) map to the design-system color families; any other string is read as `--hub-sys-color-<variant>`.

```html
<hub-calendar variant="success" [events]="events()"></hub-calendar>
```

Two accent tokens back this behaviour:

| Variable                       | Default                                                         | Description                                |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| `--hub-calendar-accent`        | `var(--hub-sys-color-primary, #3b82f6)`                        | Base accent (active button, event chips)   |
| `--hub-calendar-accent-subtle` | `color-mix(in srgb, var(--hub-calendar-accent) 16%, var(--hub-calendar-bg, #fff))` | Subtle accent (selected day background)    |

### `hub-calendar-theme()` Sass Mixin

Theme a calendar in a single include. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-calendar-*` overrides. Token-based, with no Bootstrap dependency.

```scss
@use 'ng-hub-ui-calendar/styles/mixins/calendar-theme' as *;

.planner {
	@include hub-calendar-theme(
		$accent: var(--hub-sys-color-info),
		$day-min-height: 110px,
		$event-border-radius: 999px
	);
}
```

Framework-agnostic customization example:

```scss
hub-calendar {
	--hub-calendar-bg: #ffffff;
	--hub-calendar-border-color: #d0d7de;
	--hub-calendar-btn-active-bg: #0d6efd;
	--hub-calendar-event-bg: #2563eb;
}
```

Bootstrap integration example (optional):

```scss
hub-calendar {
	--hub-calendar-bg: var(--bs-body-bg);
	--hub-calendar-color: var(--bs-body-color);
	--hub-calendar-border-color: var(--bs-border-color);
	--hub-calendar-btn-active-bg: var(--bs-primary);
}
```

## 📞 Support & License

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui-calendar/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)
- **License**: MIT

---

Made with ❤️ by the Hub UI team
