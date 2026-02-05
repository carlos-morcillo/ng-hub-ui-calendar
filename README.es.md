# ng-hub-ui-calendar

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-calendar.svg)](https://www.npmjs.com/package/ng-hub-ui-calendar)
[![license](https://img.shields.io/npm/l/ng-hub-ui-calendar.svg)](https://github.com/carlos-morcillo/ng-hub-ui-calendar/blob/main/LICENSE)

Un componente de calendario potente y flexible para aplicaciones Angular con múltiples vistas, funcionalidad de arrastrar y soltar nativa, plantillas personalizadas y soporte completo de internacionalización.

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería es parte del ecosistema **Hub UI**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar) ← Estás aquí
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Inicio Rápido](#-inicio-rápido)
- [Ejemplos](#-ejemplos)
    - [Calendario Básico](#calendario-básico)
    - [Tipos de Vista](#tipos-de-vista)
    - [Plantillas Personalizadas](#plantillas-personalizadas)
    - [Arrastrar y Soltar](#arrastrar-y-soltar)
    - [Configuración](#configuración)
    - [Internacionalización](#internacionalización)
    - [Manejo de Eventos](#manejo-de-eventos)
- [Referencia de la API](#-referencia-de-la-api)
- [Estilos](#-estilos)
- [Soporte y Licencia](#-soporte-y-licencia)

## ✨ Características

- **Múltiples Tipos de Vista**: Vistas de Mes, Semana, Día y Año
- **Arrastrar y Soltar Nativo**: Reprograma eventos arrastrándolos a diferentes días
- **Plantillas Personalizadas**: Control total sobre la renderización de eventos y celdas de día
- **Internacionalización**: Inglés y Español integrados, extensible para cualquier idioma
- **Variables CSS**: Personalización completa de estilos a través de propiedades personalizadas CSS
- **TypeScript**: Definiciones de tipos completas con CalendarViewType enum
- **Componentes Standalone**: Funciona con la arquitectura standalone moderna de Angular
- **Accesible**: Navegación por teclado y soporte ARIA
- **Ligero**: Sin dependencias externas (arrastrar y soltar nativo de HTML5)

## 📦 Instalación

```bash
npm install ng-hub-ui-calendar ng-hub-ui-utils
```

## 🚀 Inicio Rápido

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
			title: 'Reunión de Equipo',
			start: new Date(),
			end: new Date(Date.now() + 2 * 60 * 60 * 1000)
		}
	]);

	onEventClick(event: CalendarEvent): void {
		console.log('Evento clickeado:', event);
	}

	onDayClick(day: CalendarDay): void {
		console.log('Día clickeado:', day);
	}
}
```

## 📚 Ejemplos

### Calendario Básico

```typescript
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
	standalone: true,
	imports: [HubCalendarComponent],
	template: `<hub-calendar [events]="events()"></hub-calendar>`
})
export class BasicCalendarComponent {
	events = signal<CalendarEvent[]>([
		{ id: '1', title: 'Reunión', start: new Date() },
		{ id: '2', title: 'Almuerzo', start: new Date(), allDay: true }
	]);
}
```

### Tipos de Vista

```typescript
import { CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	template: `
		<hub-calendar [events]="events()" [view]="currentView()" (viewChange)="currentView.set($event)"> </hub-calendar>

		<div class="controls">
			<button (click)="currentView.set(CalendarViewType.MONTH)">Mes</button>
			<button (click)="currentView.set(CalendarViewType.WEEK)">Semana</button>
			<button (click)="currentView.set(CalendarViewType.DAY)">Día</button>
			<button (click)="currentView.set(CalendarViewType.YEAR)">Año</button>
		</div>
	`
})
export class ViewTypesComponent {
	CalendarViewType = CalendarViewType;
	currentView = signal<CalendarViewType>(CalendarViewType.MONTH);
}
```

### Plantillas Personalizadas

```typescript
import { HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective } from 'ng-hub-ui-calendar';

@Component({
	standalone: true,
	imports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective],
	template: `
		<hub-calendar [events]="events()">
			<!-- Plantilla de Evento Personalizada -->
			<ng-template eventTpt let-event="event">
				<div class="custom-event" [class.important]="event.data?.important">
					<span class="icon">{{ event.data?.important ? '⭐' : '📅' }}</span>
					<span>{{ event.title }}</span>
				</div>
			</ng-template>

			<!-- Plantilla de Celta de Día Personalizada -->
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
		{ id: '1', title: 'Reunión VIP', start: new Date(), data: { important: true } },
		{ id: '2', title: 'Tarea Regular', start: new Date(), data: { important: false } }
	]);
}
```

### Arrastrar y Soltar

```typescript
@Component({
	template: `
		<hub-calendar [events]="events()" [config]="{ dragAndDropEnabled: true }" (eventDrop)="onEventDrop($event)">
		</hub-calendar>
	`
})
export class DragDropComponent {
	events = signal<CalendarEvent[]>([{ id: '1', title: 'Evento Movible', start: new Date() }]);

	onEventDrop(event: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
		console.log(`Moved "${event.event.title}" from ${event.previousDate} to ${event.newDate}`);

		// Actualiza el evento en tus datos
		this.events.update((events) => events.map((e) => (e.id === event.event.id ? { ...e, start: event.newDate } : e)));
	}
}
```

### Configuración

```typescript
import { CalendarConfig, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	template: ` <hub-calendar [events]="events()" [config]="calendarConfig" [weekStartsOn]="1"> </hub-calendar> `
})
export class ConfigurationComponent {
	calendarConfig: CalendarConfig = {
		initialView: CalendarViewType.WEEK,
		weekStartsOn: 1, // Lunes
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

### Internacionalización

```typescript
// Usando traducciones integradas
@Component({
	template: ` <hub-calendar [events]="events()" [locale]="'es'"> </hub-calendar> `
})
export class I18nComponent {}

// Con HubTranslationService
// Añade traducciones del calendario a tus archivos i18n
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

### Manejo de Eventos

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
		// Abrir modal de detalles del evento
	}

	onDayClick(day: CalendarDay): void {
		// Crear nuevo evento en este día
	}

	onEventDrop(data: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
		// Actualizar fecha del evento en el backend
	}

	onViewChange(view: CalendarViewType): void {
		// Seguir analíticas de vista
	}

	onDateChange(date: Date): void {
		// Cargar eventos para el nuevo rango de fechas
	}
}
```

## 📖 Referencia de la API

### Inputs

| Input          | Tipo                 | Por Defecto  | Descripción                                            |
| -------------- | -------------------- | ------------ | ------------------------------------------------------ |
| `events`       | `CalendarEvent[]`    | `[]`         | Eventos a mostrar en el calendario                     |
| `view`         | `CalendarViewType`   | `MONTH`      | Tipo de vista actual (enlazable en dos direcciones)    |
| `selectedDate` | `Date`               | `new Date()` | Fecha seleccionada/foco (enlazable en dos direcciones) |
| `config`       | `CalendarConfig`     | `{}`         | Opciones de configuración                              |
| `eventClass`   | `string \| Function` | -            | Clase(s) CSS para eventos                              |
| `weekStartsOn` | `0-6`                | `0`          | Día en que comienza la semana (0=Domingo)              |
| `locale`       | `string`             | `'en'`       | Código de idioma para traducciones                     |

### Outputs

| Output       | Tipo                               | Descripción                                     |
| ------------ | ---------------------------------- | ----------------------------------------------- |
| `eventClick` | `CalendarEvent`                    | Emitido cuando se hace clic en un evento        |
| `dayClick`   | `CalendarDay`                      | Emitido cuando se hace clic en una celda de día |
| `eventDrop`  | `{ event, newDate, previousDate }` | Emitido cuando se suelta un evento              |
| `viewChange` | `CalendarViewType`                 | Emitido cuando cambia el tipo de vista          |
| `dateChange` | `Date`                             | Emitido cuando la navegación cambia la fecha    |

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

## 🎨 Estilos

### Variables CSS

Todos los estilos pueden ser personalizados a través de variables CSS:

```css
hub-calendar {
	/* Contenedor */
	--hub-calendar-bg: #ffffff;
	--hub-calendar-color: #1f2937;
	--hub-calendar-border-color: #e5e7eb;
	--hub-calendar-border-radius: 0.5rem;
	--hub-calendar-font-family: system-ui, -apple-system, sans-serif;

	/* Cabecera */
	--hub-calendar-header-bg: #f9fafb;
	--hub-calendar-header-padding: 1rem;

	/* Botones */
	--hub-calendar-btn-bg: #ffffff;
	--hub-calendar-btn-color: inherit;
	--hub-calendar-btn-border-color: #e5e7eb;
	--hub-calendar-btn-border-radius: 0.375rem;
	--hub-calendar-btn-hover-bg: #f3f4f6;
	--hub-calendar-btn-active-bg: #3b82f6;
	--hub-calendar-btn-active-color: #ffffff;

	/* Celdas de día */
	--hub-calendar-day-padding: 0.5rem;
	--hub-calendar-day-min-height: 80px;
	--hub-calendar-day-hover-bg: #f3f4f6;
	--hub-calendar-day-today-bg: #eff6ff;
	--hub-calendar-day-other-month-bg: #f9fafb;
	--hub-calendar-day-other-month-color: #9ca3af;
	--hub-calendar-day-weekend-bg: #fafafa;
	--hub-calendar-day-selected-bg: #dbeafe;
	--hub-calendar-day-drag-over-bg: #bfdbfe;

	/* Eventos */
	--hub-calendar-event-bg: #3b82f6;
	--hub-calendar-event-color: #ffffff;
	--hub-calendar-event-border-radius: 0.25rem;
	--hub-calendar-event-font-size: 0.75rem;

	/* Tarjetas de mes (vista anual) */
	--hub-calendar-month-card-bg: #f9fafb;
	--hub-calendar-month-card-hover-bg: #f3f4f6;
	--hub-calendar-month-card-padding: 1.5rem;

	/* Colores */
	--hub-calendar-primary: #3b82f6;
	--hub-calendar-muted: #6b7280;
}
```

### Clases CSS

| Clase                             | Descripción                      |
| --------------------------------- | -------------------------------- |
| `.hub-calendar`                   | Contenedor raíz                  |
| `.hub-calendar__header`           | Cabecera superior con navegación |
| `.hub-calendar__day`              | Contenedor de celda de día       |
| `.hub-calendar__day--today`       | Estilo para hoy                  |
| `.hub-calendar__day--selected`    | Estilo para día seleccionado     |
| `.hub-calendar__day--weekend`     | Estilo para fin de semana        |
| `.hub-calendar__day--other-month` | Días de meses adyacentes         |
| `.hub-calendar__event`            | Elemento de evento               |
| `.hub-calendar__month-card`       | Tarjeta de mes en vista anual    |

## 📞 Soporte y Licencia

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui-calendar/issues)
- **Autor**: Carlos Morcillo
- **Licencia**: MIT

---

Hecho con ❤️ por el equipo de Hub UI
