/**

 * @description Default calendar translations for English and Spanish.
 */

/**
 * Default calendar translations.
 * Provides English and Spanish translations for all calendar labels.
 *
 * To add a new language, add a key with the language code and provide all required translations:
 * - weekdays: Short weekday names (Sun, Mon, ...)
 * - weekdaysFull: Full weekday names (Sunday, Monday, ...)
 * - months: Full month names (January, February, ...)
 * - monthsShort: Short month names (Jan, Feb, ...)
 * - today, week, day, month, year: View labels
 * - previous, next: Navigation labels
 * - allDay: Label for all-day events
 *
 * @example Adding a new language
 * ```typescript
 * CALENDAR_I18N['fr'] = {
 *   weekdays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
 *   months: ['Janvier', 'Février', ...],
 *   // ... other translations
 * };
 * ```
 *
 * @example Using with HubTranslationService
 * The component will automatically look for translations under the 'calendar' namespace:
 * ```json
 * {
 *   "calendar": {
 *     "weekdays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
 *     "months": ["January", "February", ...]
 *   }
 * }
 * ```
 */
export const CALENDAR_I18N: Record<string, Record<string, any>> = {
	/**
	 * English translations (default)
	 */
	en: {
		weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		today: 'Today',
		week: 'Week',
		day: 'Day',
		month: 'Month',
		year: 'Year',
		previous: 'Previous',
		next: 'Next',
		allDay: 'All day'
	},
	/**
	 * Spanish translations
	 */
	es: {
		weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
		weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		months: [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
		],
		monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		today: 'Hoy',
		week: 'Semana',
		day: 'Día',
		month: 'Mes',
		year: 'Año',
		previous: 'Anterior',
		next: 'Siguiente',
		allDay: 'Todo el día'
	}
};
