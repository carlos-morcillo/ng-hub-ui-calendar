# Changelog

All notable changes to this project will be documented in this file.

## [22.6.0] - 2026-08-14

### Changed

- **Labels now resolve `HUBUI.CALENDAR.*` before the legacy `calendar.*` branch.** The collision-safe namespace lets an application dictionary feed the calendar through `provideHubTranslationAdapter()` without reserving a top-level `calendar` key. Existing `calendar.*` dictionaries keep working — the legacy branch is still the fallback.
- **Dictionary changes are now reactive.** The component tracks translation-source emissions, so switching language refreshes the calendar labels instead of leaving the strings resolved at first render under `OnPush`.

### Added

- README documentation for the application-wide translation adapter (`provideHubTranslationAdapter()` from `ng-hub-ui-utils`).

## [22.5.1] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.5.0] - 2026-07-28

### Added

- **Accessibility layer (WAI-ARIA grid + keyboard navigation).** The month view is now exposed as a labelled `role="grid"` (accessible name = the visible month/year, localized): weekday headers are `role="columnheader"` cells in a `role="row"`, week rows are `role="row"` inside a `role="rowgroup"`, and day cells are `role="gridcell"` with `aria-selected` (selected day), `aria-current="date"` (today) and a localized full-date `aria-label` (e.g. "Wednesday, July 15, 2026", built from the calendar i18n tables).
- **Keyboard navigation on the month grid** with a roving tabindex — the selected day is the single tabbable cell, so selection follows keyboard focus, matching the existing header navigation model where previous/next also move `selectedDate`. Arrow keys move by day/week, Home/End jump to the start/end of the week, PageUp/PageDown move to the same day in the previous/next month (clamped to the target month's last day, and emitting `dateChange` like the header buttons), and Enter/Space activate the day exactly like a click (`dayClick`). DOM focus is restored on the target cell after the grid re-renders, so it survives month changes.
- **Interactive elements are now real controls.** Event chips (month, week and day views) and year-view month cards expose `role="button"`, `tabindex="0"`, an `aria-label` and Enter/Space activation wired to the same outputs as their click handlers (`eventClick` / month drill-down). The icon-only previous/next header buttons gained localized `aria-label`s (their glyphs are `aria-hidden`), the view-switcher buttons expose `aria-pressed`, and the header title is an `aria-live="polite"` region so month changes are announced.
- **Keyboard focus rings** (`:focus-visible`) on day cells, event chips and month cards, derived from the existing `--hub-calendar-accent` / `--hub-calendar-accent-on` tokens (no new tokens).
- **Starter unit test suite** (`calendar.component.spec.ts`, 23 specs): creation, month grid rendering, view switching, day/event/month-card activation by mouse and keyboard, roving tabindex and month-crossing navigation, and ARIA attribute coverage. The monorepo test runner picks the library up automatically now that it ships specs.

### Fixed

- **SSR-safe drag-end cleanup.** `onDragEnd` cleaned up lingering drag-over classes via a bare `document.querySelectorAll`, which breaks on the server; the query is now scoped to the component's own host element (also preventing one calendar instance from touching another's cells).

### Notes

- Drag-and-drop event rescheduling remains **pointer-only**; a keyboard rescheduling interaction is intentionally out of scope for this release.

## [22.4.1] - 2026-07-26

### Fixed

- Declared the real `ng-hub-ui-utils` peer range: `>=22.6.0`. The library imports `HubOverflowTooltipDirective` (utils 22.6.0) and `HubTranslationService`; the previous `>=1.0.0` floor resolved to a utils major that lacks those symbols, producing installs that compile but fail at runtime.

## [22.4.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-calendar/styles`.** The theme mixin now builds to `dist/calendar/styles/...` (was `dist/calendar/src/lib/styles/...`), so `@use 'ng-hub-ui-calendar/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

## [22.3.1] - 2026-07-02

### Fixed

- CSS variable fallbacks realigned to the ds light defaults (`--hub-sys-color-primary`: `#3b82f6` → `#0d6efd`; `--hub-sys-state-hover-bg`: `#f3f4f6` → `rgba(0, 0, 0, 0.075)`; `--hub-sys-transition-base`: `all 0.15s ease` → `all 0.2s ease-in-out`; `--hub-ref-font-family-base`: `system-ui, -apple-system, sans-serif` → `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`); fallbacks only apply when ng-hub-ui-ds is not loaded.
- Stale old-palette inline fallbacks for the today/selected day backgrounds (`#eff6ff`, `#dbeafe`) now mirror the accent-derived host defaults (`color-mix` from `--hub-calendar-accent` / `--hub-calendar-accent-subtle`), so they follow custom accents even if the host declarations are unset.
- The two bare day-cell / day-column hover transitions (`background 0.15s ease`) now match the ds base timing (`background 0.2s ease-in-out`).
- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).

## [22.3.0] - 2026-06-30

### Added

- **Tooltip on truncated event titles.** Calendar events already clip their title with an ellipsis when they don't fit the cell; hovering a clipped event now reveals its full title via the hub-ui tooltip — applied automatically through `ng-hub-ui-utils`' `[hubOverflowTooltip]`, only when the title actually overflows. The tooltip is **agnostic**: it defaults to the hub-ui tooltip but is swappable with `provideHubTooltip(...)`. No API changes; requires `ng-hub-ui-utils >= 22.6.0` and the tooltip styles (`@use 'ng-hub-ui-utils/styles/tooltip';`).

## [22.2.0] - 2026-06-26

### Changed

- **Accent system migrated to the open-set "local accent slot" pattern.** `<hub-calendar variant="…">` now re-bases a single `--hub-calendar-accent` slot, and the role family — `--hub-calendar-accent-emphasis`, `--hub-calendar-accent-subtle` and the new `--hub-calendar-accent-on` (contrast colour) — is derived **locally** from it with `color-mix(in oklch, …)` / relative color, mirroring the `ng-hub-ui-ds` engine. The built-in variant list grew from 5 to the **nine canonical accents** (`primary · secondary · success · danger · warning · info · neutral · light · dark`), and a bare `[data-variant]` block re-derives the family from the slot so **any custom accent** the host app adds to the ds `$hub-accents` map (e.g. `brand`) works at runtime with one CSS rule — no library recompilation. The active view button and event chip text now read `--hub-calendar-accent-on` for automatic contrast.

### Added

- New tokens `--hub-calendar-accent-on` (grayscale contrast flip driven by the accent's own lightness) and `--hub-calendar-accent-emphasis`.

### Fixed

- Migrated the accent `color-mix()` derivations from the `srgb` colour space to `oklch` for perceptually uniform tints, matching `ng-hub-ui-ds`.

## [22.1.2] - 2026-06-26

### Fixed

- Corrected the `ng-hub-ui-utils` peer dependency range to `>=1.0.0`. The previous caret range (`^1.x`) resolved to `>=1 <2`, which excluded the current `ng-hub-ui-utils` (22.x) and made the peer impossible to satisfy.

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New **`variant` input** on `<hub-calendar>` selecting a **semantic accent**: `<hub-calendar variant="success">` recolours the today / selected day, the active view button and the event chips. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) map to the design-system families via a CSS `@each` loop; **any other string is also accepted** — the accent reads `--hub-sys-color-<variant>`. Defaults to primary. New tokens `--hub-calendar-accent` and `--hub-calendar-accent-subtle`.
- New **`hub-calendar-theme()` Sass mixin** (`styles/mixins/calendar-theme`) — theme a calendar in one call: accent, surfaces, header, nav/view buttons, day cells and event chips. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-calendar-*` overrides. Token-based, no Bootstrap dependency.

### Fixed

- The **today** cell background (`--hub-calendar-day-today-bg`) and the selected-day / active-button / event colours now derive from `--hub-calendar-accent` instead of being hard-wired to a fixed blue, so they follow the `variant` and theme overrides. No visual change with the default (primary) accent.

### Changed

- Replaced the uniform `padding` shorthands (`--hub-calendar-day-padding`, `--hub-calendar-header-padding`, `--hub-calendar-month-card-padding`) with the canonical directional `-padding-x` / `-padding-y` tokens. No visual change. **BREAKING**: set the `-x`/`-y` tokens instead of the removed shorthand.

## [21.1.1] - 2026-03-19

### Changed

- Moved `calendar.scss` from `src/lib/styles/` to co-locate with the component at
  `src/lib/components/calendar/calendar.component.scss`, referenced via `styleUrl`.
  Styles are now bundled automatically — no manual `@use` import is required.
- Removed hardcoded design system token defaults (`--hub-ref-*`, `--hub-sys-*`) from
  the stylesheet. These tokens are expected from the host application's design system;
  all `--hub-calendar-*` variables retain their literal fallback values.

### Fixed

- Added `min-width: 0` to month grid tracks, day cells, and event containers to prevent
  intrinsic content width from expanding grid columns beyond their allotted space.
- Added `width: 100%; max-width: 100%; box-sizing: border-box` to event elements to
  ensure proper clipping within day cell boundaries.

## [22.0.0] - 2026-03-10

### Changed

- **BREAKING CHANGE:** Renamed the global `src/lib/styles/base.scss` file to `src/lib/styles/calendar.scss`.
- Added host class `.hub-calendar` directly to the `hub-calendar` element for better encapsulation.

## [21.0.0] - 2026-03-09

### Changed

- **BREAKING CHANGE:** Consolidated and refactored the SCSS variables to prefix them strictly according to standard (`--hub-calendar-*`). See `BREAKING_CHANGES.md` for migration.

## [19.0.3] - 2026-02-09

### Changed

- Relax Angular peer dependencies to `>=19.0.0`.

## [19.0.2] - 2026-02-05

### Changed

- Documentation updates.
- CI/CD workflow integration.
