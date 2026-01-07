import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Directive to define a custom template for calendar events.
 */
@Directive({
	selector: '[eventTpt]',
	standalone: true
})
export class EventTemplateDirective {
	readonly template = inject(TemplateRef<any>);
}
