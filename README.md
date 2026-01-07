# ng-hub-ui-calendar

Angular Calendar component with multiple views (month, week, day, year) and event management.

## Installation

```bash
npm install ng-hub-ui-calendar
```

## Usage

```typescript
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
	imports: [HubCalendarComponent],
	template: `
		<hub-calendar [events]="events()" [view]="view()" (eventClick)="onEventClick($event)" (dayClick)="onDayClick($event)">
		</hub-calendar>
	`
})
export class MyComponent {
	view = signal<CalendarViewType>('month');
	events = signal<CalendarEvent[]>([{ id: '1', title: 'Meeting', start: new Date() }]);
}
```

## Features

-   Multiple views: month, week, day, year
-   Event display with custom templates
-   Drag and drop event rescheduling
-   Custom day cell templates
-   Internationalization support
-   CSS variables for theming
