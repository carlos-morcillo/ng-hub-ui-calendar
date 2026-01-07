import { NgModule } from '@angular/core';
import { HubCalendarComponent } from './components/calendar/calendar.component';
import { DayCellTemplateDirective } from './directives/day-cell-template.directive';
import { EventTemplateDirective } from './directives/event-template.directive';

/**
 * NgModule for ng-hub-ui-calendar.
 * Use this module for legacy applications. For modern Angular apps,
 * import components directly as standalone.
 */
@NgModule({
	imports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective],
	exports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective]
})
export class CalendarModule {}
