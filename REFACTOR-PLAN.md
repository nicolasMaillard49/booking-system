# booking-system UI Refactor Plan

## Goal
Upgrade from Nuxt UI to custom HTML+CSS for premium Planity-inspired design

## Current Status
- **32 Vue components** across booking, admin, shared sections
- **Already using**: Tailwind CSS, custom SVG icons
- **To remove**: Nuxt UI dependencies where present
- **To enhance**: Scoped CSS animations, micro-interactions

## Component Breakdown

### ✅ Already Done (9 components)
```
- pages/booking/index.vue (hero + services list)
- components/booking/ServiceCard.vue (improved selection)
- pages/booking/[serviceId].vue (service details)
- components/booking/SlotPicker.vue (date/time selection)
- components/booking/BookingForm.vue (contact form)
- pages/booking/confirm.vue (confirmation step)
- pages/booking/success.vue (success state)
- pages/appointment/[token].vue (appointment management)
- components/appointment/AppointmentCard.vue (appointment details)
```

### 🔄 IN PROGRESS (23 components)
#### Admin Pages (11)
- [ ] pages/admin/index.vue (dashboard)
- [ ] pages/admin/login.vue (auth)
- [ ] pages/admin/calendar.vue (booking calendar)
- [ ] pages/admin/services/index.vue (services list)
- [ ] pages/admin/appointments/index.vue (appointments list)
- [ ] pages/admin/custom-fields/index.vue (fields management)
- [ ] pages/admin/email-templates/index.vue (email editor)
- [ ] pages/admin/availability/index.vue (availability rules)
- [ ] pages/admin/settings/index.vue (settings)
- [ ] pages/admin/users/index.vue (team management)
- [ ] pages/admin/users/[id].vue (user detail)

#### Admin Components (10)
- [ ] components/admin/Layout.vue (admin layout)
- [ ] components/admin/AppointmentList.vue (list view)
- [ ] components/admin/AppointmentDetail.vue (detail view)
- [ ] components/admin/AppointmentFilters.vue (filters)
- [ ] components/admin/ServiceForm.vue (service editor)
- [ ] components/admin/AvailabilityWeekEditor.vue (availability)
- [ ] components/admin/CustomFieldForm.vue (field editor)
- [ ] components/admin/ExceptionForm.vue (exception editor)
- [ ] components/admin/ExceptionsList.vue (exceptions list)
- [ ] components/admin/SettingsForm.vue (settings form)

#### Shared Components (2)
- [ ] components/shared/StatusBadge.vue (status indicator)
- [ ] components/booking/FieldRenderer.vue (form field renderer)

## Design Standards

### Colors (Zinc Primary)
```
Primary: #18181b (zinc-900)
Borders: #e4e4e7 (zinc-200)
Background: #fafafa (zinc-50) / #f4f4f5 (zinc-100)
Success: #10b981 (emerald-500)
Warning: #f59e0b (amber-500)
Error: #ef4444 (red-500)
Info: #3b82f6 (blue-500)
Text: #09090b (zinc-950)
```

### Typography
```
Headings: Space Grotesk, bold
Body: Space Grotesk, regular
Monospace: Monaco / Courier, for codes
```

### Spacing
```
Base unit: 0.25rem (4px)
Scales: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32
```

### Components Style Guide
```
Cards: rounded-xl, border border-zinc-200, shadow-sm
Buttons: rounded-lg, px-4 py-2, font-medium
Inputs: rounded-lg, border border-zinc-200, px-3 py-2
```

### Animations
```
Hover: 150-200ms ease-out
Focus: 150ms ease-out
Loading: 300ms infinite
Transitions: all 0.2s ease
```

## Implementation Order

### Phase 1: Admin Core (Critical Path)
1. [ ] Admin Layout component
2. [ ] Admin Dashboard page
3. [ ] Admin Login page
4. [ ] StatusBadge shared component

### Phase 2: Admin CRUD (Data Management)
5. [ ] Services management page + form
6. [ ] Appointments list + detail + filters
7. [ ] Custom fields form + list
8. [ ] Exceptions form + list

### Phase 3: Admin Advanced
9. [ ] Availability week editor
10. [ ] Email templates editor
11. [ ] Settings form
12. [ ] Users management

### Phase 4: Shared & Polish
13. [ ] FieldRenderer component (form fields)
14. [ ] Global style refinements
15. [ ] Animation polish across all components
16. [ ] Accessibility audit

## Metrics

| Phase | Components | Est. Hours | Priority |
|-------|-----------|-----------|----------|
| Phase 1 | 4 | 6 | 🔴 Critical |
| Phase 2 | 8 | 12 | 🟠 High |
| Phase 3 | 4 | 6 | 🟡 Medium |
| Phase 4 | 2 | 4 | 🟢 Low |
| **TOTAL** | **23** | **28** | - |

## Testing Checklist

- [ ] Admin auth flow works
- [ ] Admin dashboard renders correctly
- [ ] CRUD operations functional
- [ ] Forms validate properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations smooth (60fps)
- [ ] Accessibility (WCAG 2.1)
- [ ] Dark mode compatible (if needed)

## Git Strategy

```bash
# One commit per component/page
git commit -m "refactor: Replace Nuxt UI with custom styling in ComponentName"

# One push per phase
git push origin main
```

## Success Criteria

✅ All 32 components refactored
✅ Premium Planity-inspired aesthetic
✅ No Nuxt UI dependencies
✅ All tests passing
✅ Lighthouse 90+
✅ Mobile responsive
✅ Smooth animations

---

**Status**: Ready to start Phase 1
**Next**: Begin with Admin Layout & Dashboard
