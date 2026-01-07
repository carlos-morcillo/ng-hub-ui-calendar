/**

 * @description NgModule for ng-hub-ui-calendar.
 */

import { NgModule } from '@angular/core';

import { HubCalendarComponent } from './components/calendar/calendar.component';
import { DayCellTemplateDirective } from './directives/day-cell-template.directive';
import { EventTemplateDirective } from './directives/event-template.directive';

/**
 * NgModule for ng-hub-ui-calendar.
 *
 * Use this module for legacy applications using NgModule-based architecture.
 * For modern Angular apps (v14+), import components directly as standalone.
 *
 * @example NgModule usage
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
