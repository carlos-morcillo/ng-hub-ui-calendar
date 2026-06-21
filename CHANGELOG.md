# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
