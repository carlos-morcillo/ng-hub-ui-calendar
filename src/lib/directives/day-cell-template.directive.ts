import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Directive to define a custom template for day cells.
 */
@Directive({
	selector: '[dayCellTpt]',
	standalone: true
})
export class DayCellTemplateDirective {
	readonly template = inject(TemplateRef<any>);
}
