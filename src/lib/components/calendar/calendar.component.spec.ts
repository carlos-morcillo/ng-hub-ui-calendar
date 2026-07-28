import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarEvent } from '../../models/calendar-event';
import { CalendarViewType } from '../../models/calendar-view';
import { HubCalendarComponent } from './calendar.component';

describe('HubCalendarComponent', () => {
	let fixture: ComponentFixture<HubCalendarComponent>;
	let component: HubCalendarComponent;
	let componentRef: ComponentRef<HubCalendarComponent>;

	/** Fixed reference date: Wednesday, July 15, 2026. */
	const baseDate = new Date(2026, 6, 15);

	const mockEvents: CalendarEvent[] = [
		{ id: 1, title: 'Team sync', start: new Date(2026, 6, 15, 10, 0) },
		{ id: 2, title: 'Release review', start: new Date(2026, 6, 20, 9, 0) }
	];

	/** All rendered month-view day cells. */
	function dayCells(): HTMLElement[] {
		return fixture.debugElement.queryAll(By.css('.hub-calendar__day')).map((de) => de.nativeElement as HTMLElement);
	}

	/** The single tabbable (roving tabindex) day cell. */
	function focusableCell(): HTMLElement {
		return (fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__day[tabindex="0"]') as HTMLElement;
	}

	/** Dispatches a keydown on an element and flushes change detection. */
	function keydownOn(el: HTMLElement, key: string): void {
		el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
		fixture.detectChanges();
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HubCalendarComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HubCalendarComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;

		// Drive signal inputs through the component ref (zoneless-safe).
		componentRef.setInput('selectedDate', new Date(baseDate));
		componentRef.setInput('events', mockEvents);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Month view rendering', () => {
		it('renders a 6x7 grid of day cells and 7 weekday headers', () => {
			expect(dayCells().length).toBe(42);
			expect(fixture.debugElement.queryAll(By.css('.hub-calendar__weekday')).length).toBe(7);
		});

		it('shows the localized month and year in the header title', () => {
			const title = (fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__title') as HTMLElement;
			expect(title.textContent).toContain('July 2026');
		});
	});

	describe('View switching', () => {
		it('switches views through the setInput API', () => {
			componentRef.setInput('view', CalendarViewType.WEEK);
			fixture.detectChanges();

			expect((fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__week-view')).toBeTruthy();
			expect((fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__month')).toBeFalsy();
		});

		it('switches views by clicking a view-switcher button', () => {
			const buttons = fixture.debugElement
				.queryAll(By.css('.hub-calendar__views .hub-calendar__btn'))
				.map((de) => de.nativeElement as HTMLButtonElement);
			const weekButton = buttons.find((b) => b.textContent?.trim() === 'Week') as HTMLButtonElement;

			weekButton.click();
			fixture.detectChanges();

			expect(component.view()).toBe(CalendarViewType.WEEK);
			expect(weekButton.getAttribute('aria-pressed')).toBe('true');
		});
	});

	describe('Day interaction', () => {
		it('emits dayClick and selects the day when a cell is clicked', () => {
			const emitted: Date[] = [];
			component.dayClick.subscribe((day) => emitted.push(day.date));

			// The cell for July 1st (first current-month cell of the grid).
			const target = dayCells().find(
				(cell) => cell.getAttribute('aria-label') === 'Wednesday, July 1, 2026'
			) as HTMLElement;
			target.click();
			fixture.detectChanges();

			expect(emitted.length).toBe(1);
			expect(emitted[0].getDate()).toBe(1);
			expect(component.selectedDate().getDate()).toBe(1);
		});
	});

	describe('Keyboard navigation (month grid)', () => {
		it('gives the selected day the single tabindex="0" stop', () => {
			const tabbable = dayCells().filter((cell) => cell.getAttribute('tabindex') === '0');
			expect(tabbable.length).toBe(1);
			expect(tabbable[0].getAttribute('aria-label')).toBe('Wednesday, July 15, 2026');
		});

		it('moves the focus stop one day with ArrowRight', () => {
			keydownOn(focusableCell(), 'ArrowRight');

			expect(component.selectedDate().getDate()).toBe(16);
			expect(focusableCell().getAttribute('aria-label')).toBe('Thursday, July 16, 2026');
		});

		it('moves the focus stop one week with ArrowDown', () => {
			keydownOn(focusableCell(), 'ArrowDown');

			expect(component.selectedDate().getDate()).toBe(22);
		});

		it('jumps to the start and end of the week with Home/End', () => {
			keydownOn(focusableCell(), 'Home');
			expect(component.selectedDate().getDate()).toBe(12); // Sunday

			keydownOn(focusableCell(), 'End');
			expect(component.selectedDate().getDate()).toBe(18); // Saturday
		});

		it('moves to the next month with PageDown and emits dateChange', () => {
			const changes: Date[] = [];
			component.dateChange.subscribe((date) => changes.push(date));

			keydownOn(focusableCell(), 'PageDown');

			expect(component.selectedDate().getMonth()).toBe(7); // August
			expect(component.selectedDate().getDate()).toBe(15);
			expect(changes.length).toBe(1);

			const title = (fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__title') as HTMLElement;
			expect(title.textContent).toContain('August 2026');
		});

		it('moves to the previous month with PageUp, clamping the day of month', () => {
			componentRef.setInput('selectedDate', new Date(2026, 6, 31)); // July 31
			fixture.detectChanges();

			keydownOn(focusableCell(), 'PageUp');

			expect(component.selectedDate().getMonth()).toBe(5); // June
			expect(component.selectedDate().getDate()).toBe(30); // clamped (June has 30 days)
		});

		it('keeps a focusable cell after crossing a month boundary with arrows', async () => {
			// July 31 + ArrowRight lands on August 1 and re-renders the grid.
			componentRef.setInput('selectedDate', new Date(2026, 6, 31));
			fixture.detectChanges();

			keydownOn(focusableCell(), 'ArrowRight');
			await fixture.whenStable();
			fixture.detectChanges();

			const cell = focusableCell();
			expect(cell).toBeTruthy();
			expect(cell.getAttribute('aria-label')).toBe('Saturday, August 1, 2026');
		});

		it('activates the day with Enter, like a click', () => {
			const emitted: Date[] = [];
			component.dayClick.subscribe((day) => emitted.push(day.date));

			keydownOn(focusableCell(), 'Enter');

			expect(emitted.length).toBe(1);
			expect(emitted[0].getDate()).toBe(15);
		});

		it('activates the day with Space, like a click', () => {
			const emitted: Date[] = [];
			component.dayClick.subscribe((day) => emitted.push(day.date));

			keydownOn(focusableCell(), ' ');

			expect(emitted.length).toBe(1);
		});
	});

	describe('Event chips', () => {
		it('emits eventClick (and not dayClick) when a chip is clicked', () => {
			const clicked: CalendarEvent[] = [];
			const dayClicks: unknown[] = [];
			component.eventClick.subscribe((event) => clicked.push(event));
			component.dayClick.subscribe((day) => dayClicks.push(day));

			const chip = (fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__event') as HTMLElement;
			chip.click();
			fixture.detectChanges();

			expect(clicked.length).toBe(1);
			expect(clicked[0].title).toBe('Team sync');
			expect(dayClicks.length).toBe(0);
		});

		it('emits eventClick (and not dayClick) on Enter, via role="button" semantics', () => {
			const clicked: CalendarEvent[] = [];
			const dayClicks: unknown[] = [];
			component.eventClick.subscribe((event) => clicked.push(event));
			component.dayClick.subscribe((day) => dayClicks.push(day));

			const chip = (fixture.nativeElement as HTMLElement).querySelector('.hub-calendar__event') as HTMLElement;
			expect(chip.getAttribute('role')).toBe('button');
			expect(chip.getAttribute('tabindex')).toBe('0');

			keydownOn(chip, 'Enter');

			expect(clicked.length).toBe(1);
			expect(clicked[0].title).toBe('Team sync');
			expect(dayClicks.length).toBe(0);
		});
	});

	describe('Year view', () => {
		beforeEach(() => {
			componentRef.setInput('view', CalendarViewType.YEAR);
			fixture.detectChanges();
		});

		it('renders 12 month cards exposed as buttons', () => {
			const cards = fixture.debugElement.queryAll(By.css('.hub-calendar__month-card'));
			expect(cards.length).toBe(12);
			for (const card of cards) {
				expect((card.nativeElement as HTMLElement).getAttribute('role')).toBe('button');
				expect((card.nativeElement as HTMLElement).getAttribute('tabindex')).toBe('0');
			}
		});

		it('opens the month view on Enter on a month card', () => {
			const march = fixture.debugElement
				.queryAll(By.css('.hub-calendar__month-card'))
				.map((de) => de.nativeElement as HTMLElement)[2];

			keydownOn(march, 'Enter');

			expect(component.view()).toBe(CalendarViewType.MONTH);
			expect(component.selectedDate().getMonth()).toBe(2);
		});
	});

	describe('ARIA attributes', () => {
		it('exposes the month view as a labelled grid of rows and gridcells', () => {
			const host = fixture.nativeElement as HTMLElement;
			const grid = host.querySelector('[role="grid"]') as HTMLElement;

			expect(grid).toBeTruthy();
			expect(grid.getAttribute('aria-label')).toBe('July 2026');
			expect(host.querySelectorAll('[role="columnheader"]').length).toBe(7);
			expect(host.querySelectorAll('[role="row"]').length).toBe(7); // 1 header row + 6 week rows
			expect(host.querySelectorAll('[role="gridcell"]').length).toBe(42);
		});

		it('marks the selected day with aria-selected="true"', () => {
			const selected = dayCells().filter((cell) => cell.getAttribute('aria-selected') === 'true');
			expect(selected.length).toBe(1);
			expect(selected[0].getAttribute('aria-label')).toBe('Wednesday, July 15, 2026');
		});

		it('marks today with aria-current="date" when the current month is visible', () => {
			componentRef.setInput('selectedDate', new Date());
			fixture.detectChanges();

			const current = dayCells().filter((cell) => cell.getAttribute('aria-current') === 'date');
			expect(current.length).toBe(1);
			expect(current[0].textContent).toContain(String(new Date().getDate()));
		});

		it('labels the icon-only previous/next navigation buttons', () => {
			const host = fixture.nativeElement as HTMLElement;
			const nav = host.querySelectorAll('.hub-calendar__nav .hub-calendar__btn--nav');

			expect((nav[0] as HTMLElement).getAttribute('aria-label')).toBe('Previous');
			expect((nav[1] as HTMLElement).getAttribute('aria-label')).toBe('Next');
		});
	});
});
