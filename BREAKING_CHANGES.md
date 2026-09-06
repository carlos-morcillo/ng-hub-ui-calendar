# Breaking Changes in `ng-hub-ui-calendar`

This document details the breaking changes of `ng-hub-ui-calendar` and how to migrate your codebase.

The major version tracks the Angular major the library targets, so it cannot also signal a break: a breaking change ships in a **minor** release and is announced here. This file — not the version number — is the warning.

## [22.6.4] - 2026-09-06

### Announced: `CalendarModule` is removed in 23.0.0

- **Change**: the class is now marked `@deprecated`. Nothing is removed here and nothing changes at runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { CalendarModule }` and `imports: [CalendarModule]` stop compiling.
- **Migration**: import the three standalone declarables the module re-exported. All three come from the same entry point, and the module provided nothing else.

```ts
// Before
@NgModule({ imports: [CalendarModule] })
export class AppModule {}

// After
@Component({
	imports: [HubCalendarComponent, EventTemplateDirective, DayCellTemplateDirective]
})
export class AgendaComponent {}
```

## [22.4.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-calendar/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/calendar/styles/...` instead of `dist/calendar/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-calendar/styles' as *;`

## Version 22.1.0

### Removal of Shorthand Padding Tokens

The uniform `padding` shorthand tokens have been removed in favour of the canonical directional `-padding-x` / `-padding-y` token pairs. This brings the calendar in line with the rest of the ecosystem, where every spacing token exposes independent horizontal and vertical control. The default rendering is unchanged.

The following tokens were **removed**:

- `--hub-calendar-day-padding`
- `--hub-calendar-header-padding`
- `--hub-calendar-month-card-padding`

**Migration Steps:**

If you override any of the removed shorthand tokens, replace each one with the corresponding `-padding-x` / `-padding-y` pair:

- `--hub-calendar-day-padding: 0.5rem;` becomes `--hub-calendar-day-padding-x: 0.5rem;` and `--hub-calendar-day-padding-y: 0.5rem;`
- `--hub-calendar-header-padding: 1rem;` becomes `--hub-calendar-header-padding-x: 1rem;` and `--hub-calendar-header-padding-y: 1rem;`
- `--hub-calendar-month-card-padding: 1.5rem;` becomes `--hub-calendar-month-card-padding-x: 1.5rem;` and `--hub-calendar-month-card-padding-y: 1.5rem;`

If you never overrode these tokens, no action is required.

## [22.0.0] - 2026-03-10

### `base.scss` renamed to `calendar.scss`

- **Change**: the global stylesheet `src/lib/styles/base.scss` was renamed to `src/lib/styles/calendar.scss`.
- **Impact**: a `@use` pointing at the old file name no longer resolves.
- **Migration**: none is needed from 21.1.1 onwards — the stylesheet is co-located with the component and
  bundled through `styleUrl`, so no manual import exists to update. The only stylesheet a consumer still
  `@use`s is the theming entry, `ng-hub-ui-calendar/styles` (see 22.4.0).

## Version 21.0.0

### SCSS Variables Standardization

All SCSS custom properties used for overriding `hub-calendar` tokens have been renamed to conform to the ecosystem's strictest naming conventions. The previous namespace strategy used a mix of local variable inclusions that would compile as `--calendar-*` or simply the base element.

All variables have been consolidated to use the strict prefix format `--hub-calendar-*`.
Additionally, all variables are now properly backed by the ecosystem fallback properties (e.g. `var(--hub-sys-surface-elevated)`).

**Migration Steps:**

**Update Variable Names:**
If you override the default variables, you must rename them in your CSS/SCSS selectors pointing to `hub-calendar`.
For instance:

- `var(--calendar-bg)` becomes `var(--hub-calendar-bg)`
- `var(--calendar-month-card-padding)` becomes `var(--hub-calendar-month-card-padding)`
- `var(--calendar-day-hover-bg)` becomes `var(--hub-calendar-day-hover-bg)`

For the complete list of `--hub-calendar-*` variables, consult [`./docs/css-variables-reference.md`](./docs/css-variables-reference.md).
