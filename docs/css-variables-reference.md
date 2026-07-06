# ng-hub-ui-calendar - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-calendar`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Importing Styles](#importing-styles)
- [Base System Fallbacks](#base-system-fallbacks)
- [Calendar Variables](#calendar-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

Calendar styles use this fallback chain:

```text
component token -> sys token -> ref token -> literal fallback
```

This allows runtime theming while keeping defaults stable and self-contained.

---

## Importing Styles

Add calendar styles to your global stylesheet:

```scss
@use 'ng-hub-ui-calendar/src/lib/styles/base.scss';
```

---

## Base System Fallbacks

`ng-hub-ui-calendar` defines and/or consumes these base tokens:

| Variable | Default |
| --- | --- |
| `--hub-ref-color-white` | `#ffffff` |
| `--hub-ref-space-1` | `0.25rem` |
| `--hub-ref-space-2` | `0.5rem` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-ref-space-4` | `1.5rem` |
| `--hub-ref-radius-sm` | `0.25rem` |
| `--hub-ref-radius-md` | `0.5rem` |
| `--hub-ref-font-family-base` | `system-ui, -apple-system, sans-serif` |
| `--hub-ref-font-size-xs` | `0.625rem` |
| `--hub-ref-font-size-sm` | `0.75rem` |
| `--hub-ref-font-size-base` | `0.875rem` |
| `--hub-ref-font-size-lg` | `1rem` |
| `--hub-sys-surface-page` | `#ffffff` |
| `--hub-sys-surface-elevated` | `#f9fafb` |
| `--hub-sys-text-primary` | `#1f2937` |
| `--hub-sys-text-muted` | `#6b7280` |
| `--hub-sys-border-color-default` | `#e5e7eb` |
| `--hub-sys-color-primary` | `#3b82f6` |
| `--hub-sys-color-primary-subtle` | `#dbeafe` |
| `--hub-sys-transition-base` | `all 0.15s ease` |

---

## Calendar Variables

Defined and consumed by `projects/calendar/src/lib/styles/base.scss`.

### Core Container

| Variable | Default |
| --- | --- |
| `--hub-calendar-bg` | `var(--hub-sys-surface-page, #ffffff)` |
| `--hub-calendar-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-calendar-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-calendar-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` |
| `--hub-calendar-accent` | `var(--hub-sys-color-primary, #0d6efd)` |
| `--hub-calendar-accent-subtle` | `color-mix(in oklch, var(--hub-calendar-accent) 12%, var(--hub-sys-surface-page, #fff))` |
| `--hub-calendar-font-family` | `var(--hub-ref-font-family-base, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif)` |
| `--hub-calendar-primary` | `var(--hub-calendar-accent)` |
| `--hub-calendar-muted` | `var(--hub-sys-text-muted, #6c757d)` |

### Header

| Variable | Default |
| --- | --- |
| `--hub-calendar-header-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-calendar-header-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-calendar-header-padding-y` | `var(--hub-ref-space-3, 1rem)` |

### Buttons

| Variable | Default |
| --- | --- |
| `--hub-calendar-btn-bg` | `var(--hub-ref-color-white, #ffffff)` |
| `--hub-calendar-btn-color` | `inherit` |
| `--hub-calendar-btn-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-calendar-btn-border-radius` | `var(--hub-ref-radius-sm, 0.25rem)` |
| `--hub-calendar-btn-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-calendar-btn-padding-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-calendar-btn-hover-bg` | `var(--hub-sys-state-hover-bg, rgba(0, 0, 0, 0.075))` |
| `--hub-calendar-btn-active-bg` | `var(--hub-calendar-accent)` |
| `--hub-calendar-btn-active-color` | `var(--hub-calendar-accent-on, var(--hub-ref-color-white, #ffffff))` |
| `--hub-calendar-btn-transition` | `var(--hub-sys-transition-base, all 0.2s ease-in-out)` |

### Day Cells

| Variable | Default |
| --- | --- |
| `--hub-calendar-day-padding-x` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-calendar-day-padding-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-calendar-day-min-height` | `80px` |
| `--hub-calendar-day-hover-bg` | `var(--hub-sys-state-hover-bg, rgba(0, 0, 0, 0.075))` |
| `--hub-calendar-day-today-bg` | `color-mix(in oklch, var(--hub-calendar-accent) 8%, var(--hub-calendar-bg, #fff))` |
| `--hub-calendar-day-other-month-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-calendar-day-other-month-color` | `var(--hub-sys-text-muted, #6c757d)` |
| `--hub-calendar-day-weekend-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-calendar-day-selected-bg` | `var(--hub-calendar-accent-subtle)` |
| `--hub-calendar-day-drag-over-bg` | `color-mix(in oklch, var(--hub-calendar-accent) 32%, var(--hub-calendar-bg, #fff))` |

### Events

| Variable | Default |
| --- | --- |
| `--hub-calendar-event-bg` | `var(--hub-calendar-accent)` |
| `--hub-calendar-event-color` | `var(--hub-calendar-accent-on, var(--hub-ref-color-white, #ffffff))` |
| `--hub-calendar-event-border-radius` | `var(--hub-ref-radius-sm, 0.25rem)` |
| `--hub-calendar-event-padding-x` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-calendar-event-padding-y` | `var(--hub-ref-space-1, 0.25rem)` |
| `--hub-calendar-event-font-size` | `var(--hub-ref-font-size-sm, 0.875rem)` |

### Year View Month Cards

| Variable | Default |
| --- | --- |
| `--hub-calendar-month-card-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-calendar-month-card-hover-bg` | `var(--hub-sys-state-hover-bg, rgba(0, 0, 0, 0.075))` |
| `--hub-calendar-month-card-padding-x` | `var(--hub-ref-space-4, 1.5rem)` |
| `--hub-calendar-month-card-padding-y` | `var(--hub-ref-space-4, 1.5rem)` |

---

## Customization Examples

### Framework-Agnostic

```scss
hub-calendar {
  --hub-calendar-bg: #ffffff;
  --hub-calendar-border-color: #d0d7de;
  --hub-calendar-btn-active-bg: #0d6efd;
  --hub-calendar-event-bg: #2563eb;
  --hub-calendar-day-today-bg: #e7f1ff;
}
```

### Bootstrap Integration (Optional)

```scss
hub-calendar {
  --hub-calendar-bg: var(--bs-body-bg);
  --hub-calendar-color: var(--bs-body-color);
  --hub-calendar-border-color: var(--bs-border-color);
  --hub-calendar-btn-active-bg: var(--bs-primary);
  --hub-calendar-event-bg: var(--bs-primary);
}
```

### Dense Calendar Layout

```scss
hub-calendar {
  --hub-calendar-header-padding-x: 0.75rem;
  --hub-calendar-header-padding-y: 0.75rem;
  --hub-calendar-day-min-height: 64px;
  --hub-calendar-event-font-size: 0.6875rem;
  --hub-calendar-month-card-padding-x: 1rem;
  --hub-calendar-month-card-padding-y: 1rem;
}
```

---

## Best Practices

- Prefer `--hub-calendar-*` tokens for calendar-specific theming.
- Override `--hub-sys-*` tokens when you want consistent theming across components.
- Keep Bootstrap tokens (`--bs-*`) as optional integration, not as required defaults.
- Use token overrides before using selector-level overrides.
