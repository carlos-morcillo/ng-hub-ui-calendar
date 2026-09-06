# Changelog

All notable changes to this project will be documented in this file.

## [22.6.4] - 2026-09-06

### Fixed

- **`locale` stopped at the header.** 22.6.1 pulled the header buttons into the dictionary and left the rest behind: the month cell still overflowed into `+2 more`, a year-view card still read `3 events`, that same card announced `, 3 events` to a screen reader, and the week and day headings took their weekday and month names from `DatePipe` — the application's `LOCALE_ID`, not the calendar's `locale`. A calendar set to Spanish therefore mixed both languages inside one grid, and, as in 22.6.1, nothing a consumer passed could reconcile them: the two literals were written into the template and the bundled dictionaries had no key to override them.

    All four now resolve through the same lookup as the weekday and month names. The count labels arrive as two new dictionary keys, `moreEvents` and `eventCount`, each carrying a `{count}` placeholder so a locale can move the number, drop the `+` or add a word after it — a consumer dictionary (`HUBUI.CALENDAR.*`, or the legacy `calendar.*`) can now reach them, and an unfilled key still falls back to English rather than rendering blank. The week-view day names and the day-view heading are built from `weekdays` / `weekdaysFull` / `months`, which is what makes them follow `locale` instead of `LOCALE_ID`; English output is unchanged, and applications whose `LOCALE_ID` already matched their `locale` see no difference either.

- **`config.weekStartsOn` decided nothing.** The `weekStartsOn` input documented itself as an override of the config field, but it was the only value any grid ever read — so an application that centralised its calendar settings in a shared `CalendarConfig` still opened every calendar on Sunday, and the only way out was repeating `[weekStartsOn]` on every template. The precedence the JSDoc promised now holds: the input wins when it is bound, the config answers when it is not, and Sunday remains the default of last resort. To tell "not bound" from "explicitly Sunday", the input no longer defaults to `0` — its type is now `0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined`, which only matters to code that reads the signal directly; every template binding keeps working unchanged.

- **Four of the nine accents could not be re-pointed from a stylesheet.** `secondary`, `neutral`, `light` and `dark` were treated as foreign variants, so the component wrote `--hub-calendar-accent` as an inline style on the host — which outranks any consumer rule, including the `hub-calendar[data-variant='…'] { --hub-calendar-accent: … }` recipe the library itself documents. All nine canonical variants now resolve through the stylesheet, as `secondary`/`neutral`/`light`/`dark` already did in the SCSS since 22.2.0. Rendering is unchanged; what changes is that a consumer rule now takes effect. Custom variants keep their inline fallback, since no stylesheet rule backs them.

- **`BREAKING_CHANGES.md` sent readers to a file that no longer exists.** The 21.0.0 migration told them to
  `@use 'ng-hub-ui-calendar/src/lib/styles/calendar.scss'` — a path emptied first by 21.1.1, when the
  stylesheet moved next to the component and stopped needing an import at all, and then by 22.4.0, when the
  theming entry became `ng-hub-ui-calendar/styles`. The same section also filed the `base.scss` rename under
  21.0.0 although it shipped in 22.0.0, and the preamble promised breaking changes "in major versions",
  which this library cannot deliver: its major tracks the Angular major it targets, so a break arrives in a
  minor and this file is the only warning a reader gets. Each break now sits under the version that shipped
  it, with a migration that resolves, and the variable count that used to be quoted as "exactly 37" is gone
  rather than left to drift again.

- **The README omitted `selectedDateChange`** from its outputs table, so a reader working from the table
  alone had no way to know `[(selectedDate)]` had a two-way half. It also documented the translation
  dictionary as the top-level `calendar.*` namespace only, and the `CALENDAR_I18N` JSDoc said the same,
  while 22.6.0 made `HUBUI.CALENDAR.*` resolve first — the namespace that exists precisely so an
  application dictionary need not reserve a top-level `calendar` key. Both now lead with `HUBUI.CALENDAR.*`
  and keep the legacy branch documented as the fallback.

- **Changelog heading order.** The 21.1.1 entry sat between 22.1.0 and 22.0.0, which makes the file
  unreadable as a history and unreliable as a source for the documentation site that mirrors it.

- **The CSS variables reference called itself complete while two accent tokens were missing.**
  `--hub-calendar-accent-emphasis` and `--hub-calendar-accent-on` are declared by the component and were
  announced in 22.2.0 as part of the accent family, yet the only file that catalogues the tokens listed
  neither — and the repo-level parity check cannot catch the omission, because it exempts the accent slots
  and only compares rows that already exist. A reader taking the file at its word had no way to learn the
  two roles are overridable, least of all `-on`, the one that decides whether text on the accent is
  readable. The table now covers all 44 declared tokens.

### Added

- **`FUNCTIONALITIES.md`.** Nine other libraries in the monorepo ship one; the calendar had no single place
  showing what the component actually supports and how much of it a running example demonstrates. The table
  is written against the code, so the accessibility layer and the application-dictionary path are marked as
  supported but unexampled instead of being implied to be covered.

### Changed

- **The component now declares `ChangeDetectionStrategy.OnPush`.** Its own JSDoc and the 22.6.0 entry both
  describe the calendar as running under OnPush, and every sibling library in the monorepo says so in its
  metadata, but this one never did — leaving the reader to guess. Nothing changes at runtime: Angular 22
  already applies OnPush unless a component opts into `Eager`, and every value the template reads is a
  signal. What changes is that the source now states the contract instead of relying on the framework
  default staying where it is.

### Deprecated

- **`CalendarModule`, marked for removal in 23.0.0.** The class documented itself as the path for
  "legacy applications using NgModule-based architecture" but carried no `@deprecated` tag, so
  neither an editor nor the build warned anyone it was on its way out. It now says so. The module
  imports and exports `HubCalendarComponent`, `EventTemplateDirective` and
  `DayCellTemplateDirective` — all three standalone, all three already exported from the entry
  point — and provides nothing of its own, so importing them directly is the whole migration. See
  `BREAKING_CHANGES.md`.

## [22.6.3] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.6.2] - 2026-08-17

### Fixed

- **The package shipped without its licence notice.** `package.json` declared MIT, but no `LICENSE` file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.

## [22.6.1] - 2026-08-16

### Fixed

- **The header buttons ignored the locale.** `Today` was written into the template by hand and the view switcher title-cased the enum, while the weekday and month names came from the dictionary — so a calendar with `locale="es"` rendered "Lun, Mar, Mié" underneath "Today / Month / Week / Day / Year". Nothing a consumer passed could reconcile the two: not `locale`, not the injected `HubTranslationService`, not CSS.

    All five labels now resolve through the same lookup as the day and month names, honouring the translation service first and falling back to the built-in dictionary — which is the contract the component already documented. `today`, `week`, `day`, `month` and `year` were present and complete in both bundled locales the whole time; only the template was not asking for them. With `locale="es"` the header now reads Hoy / Mes / Semana / Día / Año, and English is unchanged.

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

## [22.0.0] - 2026-03-10

### Changed

- **BREAKING CHANGE:** Renamed the global `src/lib/styles/base.scss` file to `src/lib/styles/calendar.scss`.
- Added host class `.hub-calendar` directly to the `hub-calendar` element for better encapsulation.

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
