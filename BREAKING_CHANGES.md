# Breaking Changes in `ng-hub-ui-calendar`

This document details the breaking changes introduced in major versions of `ng-hub-ui-calendar` and how to migrate your codebase.

## Version 21.0.0

### SCSS Variables Standardization & File Rename

All SCSS custom properties used for overriding `hub-calendar` tokens have been renamed to conform to the ecosystem's strictest naming conventions. The previous namespace strategy used a mix of local variable inclusions that would compile as `--calendar-*` or simply the base element.

All variables have been consolidated to use the strict prefix format `--hub-calendar-*`.
Additionally, all variables are now properly backed by the ecosystem fallback properties (e.g. `var(--hub-sys-surface-elevated)`).

Furthermore, the base SCSS file has been renamed from `base.scss` to `calendar.scss`.

**Migration Steps:**

1. **Update Import Path:**
   If you were compiling or importing local styles using:
   `@use 'ng-hub-ui-calendar/src/lib/styles/base.scss';`
   You must update your import path to:
   `@use 'ng-hub-ui-calendar/src/lib/styles/calendar.scss';`

2. **Update Variable Names:**
   If you override the default variables, you must rename them in your CSS/SCSS selectors pointing to `hub-calendar`.
   For instance:

- `var(--calendar-bg)` becomes `var(--hub-calendar-bg)`
- `var(--calendar-month-card-padding)` becomes `var(--hub-calendar-month-card-padding)`
- `var(--calendar-day-hover-bg)` becomes `var(--hub-calendar-day-hover-bg)`

For a complete list of exactly 37 new variable aliases supporting `ng-hub-ui-calendar`, please consult `./docs/css-variables-reference.md`.
