/**

 * @description NgModule for ng-hub-ui-calendar.
 */

import { NgModule } from '@angular/core';

import { HubCalendarComponent } from './components/calendar/calendar.component';
import { DayCellTemplateDirective } from './directives/day-cell-template.directive';
import { EventTemplateDirective } from './directives/event-template.directive';

/**
 * Backward-compatibility module for NgModule-based applications.
 *
 * @deprecated Import the standalone `HubCalendarComponent`, `EventTemplateDirective` and
 * `DayCellTemplateDirective` directly; this module only re-exports them and provides nothing
 * of its own. Scheduled for removal in **23.0.0**.
 *
 * @example NgModule usage (deprecated)
 * ```typescript
 * import { CalendarModule } from 'ng-hub-ui-calendar';
 *
 * @NgModule({
 *   imports: [CalendarModule]
 * })
 * export class AppModule {}
 * ```
 *
 * @example Standalone component usage (recommended)
 * ```typescript
 * import { HubCalendarComponent, EventTemplateDirective } from 'ng-hub-ui-calendar';
 *
 * @Component({
 *   standalone: true,
 *   imports: [HubCalendarComponent, EventTemplateDirective]
 * })
 * export class MyComponent {}
 * ```
 */
@NgModule({
	imports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective],
	exports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective]
})
export class CalendarModule {}
