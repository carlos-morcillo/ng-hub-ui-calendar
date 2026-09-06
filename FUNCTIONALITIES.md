# Functionalities of Calendar Library

This table details the functionalities of the `ng-hub-ui-calendar` library and indicates which ones are covered by interactive examples.

The library ships one component, `hub-calendar`, plus the two structural directives that let you replace its markup.

## Views and navigation

| Category       | Functionality                                     | Example Covered |
| :------------- | :------------------------------------------------ | :-------------: |
| **Views**      | Month grid (`view="month"`)                       |       ✅        |
|                | Week time grid (`view="week"`)                    |       ✅        |
|                | Day time grid (`view="day"`)                      |       ✅        |
|                | Year overview of month cards (`view="year"`)      |       ✅        |
|                | Two-way `[(view)]` / `viewChange`                 |       ✅        |
|                | Switcher narrowed by `config.availableViews`      |       ❌        |
| **Navigation** | Previous / next period buttons                    |       ✅        |
|                | `Today` shortcut                                  |       ✅        |
|                | Two-way `[(selectedDate)]` / `selectedDateChange` |       ✅        |
|                | `dateChange` emitted on navigation                |       ✅        |
|                | Year-view month card drills into that month       |       ❌        |

## Events

| Category          | Functionality                                                   | Example Covered |
| :---------------- | :-------------------------------------------------------------- | :-------------: |
| **Data**          | Typed `events` input (`CalendarEvent<T>` with a `data` payload) |       ✅        |
| **Interaction**   | `eventClick` output                                             |       ✅        |
|                   | `dayClick` output                                               |       ✅        |
| **Styling hooks** | `eventClass` input (static string or function)                  |       ✅        |
|                   | Per-event `cssClass` (static string or function)                |       ✅        |
| **Overflow**      | Month cell renders three events and a localized `+N more` label |       ❌        |
|                   | Tooltip on an event title clipped by its cell                   |       ✅        |
| **Drag & drop**   | Native HTML5 drag of an event onto another day                  |       ✅        |
|                   | `eventDrop` with the previous and the new date                  |       ✅        |
|                   | Turned off with `config.dragAndDropEnabled: false`              |       ❌        |

Dropping an event lands it on a **day**, not on a time slot, in all three views that accept a drop. The
calendar never mutates the `events` array: creating, editing and deleting an event stay in the caller's own
state, driven by the outputs above.

## Templates

| Category      | Functionality                                                | Example Covered |
| :------------ | :----------------------------------------------------------- | :-------------: |
| **Templates** | `eventTpt` replaces the event chip (context `{ event }`)     |       ✅        |
|               | `dayCellTpt` replaces the whole day cell (context `{ day }`) |       ✅        |

## Configuration

| Category        | Functionality                                          | Example Covered |
| :-------------- | :----------------------------------------------------- | :-------------: |
| **Week start**  | `weekStartsOn` input                                   |       ✅        |
|                 | `config.weekStartsOn` used when the input is not bound |       ❌        |
| **Time grid**   | `config.dayStartHour` / `config.dayEndHour`            |       ✅        |
| **Views**       | `config.availableViews`                                |       ❌        |
| **Drag & drop** | `config.dragAndDropEnabled`                            |       ❌        |

## Internationalization

| Category        | Functionality                                        | Example Covered |
| :-------------- | :--------------------------------------------------- | :-------------: |
| **Bundled**     | `locale` with the bundled `en` and `es` dictionaries |       ✅        |
|                 | Fallback to English for a locale that is not bundled |       ✅        |
| **Application** | `HUBUI.CALENDAR.*` through `HubTranslationService`   |       ❌        |
|                 | Legacy top-level `calendar.*` branch as the fallback |       ❌        |
|                 | Labels re-render when the dictionary source emits    |       ❌        |

## Accessibility

| Category      | Functionality                                                              | Example Covered |
| :------------ | :------------------------------------------------------------------------- | :-------------: |
| **Semantics** | Month view as a labelled `role="grid"` with row / columnheader / gridcell  |       ❌        |
|               | `aria-selected`, `aria-current="date"` and localized full-date cell labels |       ❌        |
|               | `aria-live` header title announcing each period change                     |       ❌        |
|               | `aria-pressed` view switcher and labelled prev / next buttons              |       ❌        |
| **Keyboard**  | Roving tabindex on the month grid                                          |       ❌        |
|               | Arrows, `Home`/`End`, `PageUp`/`PageDown`, `Enter`/`Space`                 |       ❌        |
|               | Event chips and year-view month cards activatable with `Enter`/`Space`     |       ❌        |
| **Focus**     | `:focus-visible` rings derived from the accent tokens                      |       ❌        |

The accessibility layer has no example of its own: it is exercised by the library's own unit suite
(`calendar.component.spec.ts`). Rescheduling by drag and drop remains **pointer-only** — there is no
keyboard equivalent.

## Styling

| Category          | Functionality                                                 | Example Covered |
| :---------------- | :------------------------------------------------------------ | :-------------: |
| **Accent**        | `variant` input with the nine canonical accents               |       ✅        |
|                   | Custom accent read as `--hub-sys-color-<variant>`             |       ✅        |
| **CSS variables** | `--hub-calendar-*` token overrides                            |       ✅        |
| **Sass**          | `hub-calendar-theme()` mixin from `ng-hub-ui-calendar/styles` |       ✅        |

The complete token catalogue lives in [`docs/css-variables-reference.md`](./docs/css-variables-reference.md).
