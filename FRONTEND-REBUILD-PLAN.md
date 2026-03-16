# booking-system Frontend Complete Rebuild Plan

## Goal
Rebuild entire frontend (32 Vue components) from scratch with **HTML+Tailwind+CSS** for premium Planity-inspired design

---

## Architecture

### Tech Stack
- **Framework**: Vue 3 + Nuxt 3
- **Styling**: Tailwind CSS + Scoped CSS (animations)
- **Icons**: Inline SVG (Heroicons paths)
- **Animations**: CSS keyframes (no JS libraries)
- **State**: Composition API + Pinia

### Design System

**Colors**
```
Primary: #18181b (zinc-900)
Secondary: #27272a (zinc-800)
Borders: #e4e4e7 (zinc-200)
Background: #fafafa (zinc-50)
Success: #10b981 (emerald-500)
Warning: #f59e0b (amber-500)
Error: #ef4444 (red-500)
Info: #3b82f6 (blue-500)
Text: #09090b (zinc-950)
```

**Typography**
```
Display: Space Grotesk Bold (headings)
Body: Space Grotesk Regular (content)
Mono: Monaco (codes)
Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px, 64px
```

**Spacing**
```
Base unit: 4px (0.25rem)
Scale: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64
```

**Components**
```
Cards: rounded-xl, border border-zinc-200, shadow-sm, bg-white
Buttons: rounded-lg, px-4 py-2, font-medium, hover:shadow-md
Inputs: rounded-lg, border border-zinc-200, px-3 py-2
Badges: rounded-full, px-2 py-1, text-xs
```

**Animations**
```
Hover: 150ms ease-out
Focus: 150ms ease-out
Transitions: all 0.2s ease
Loading: 400ms infinite
Fade: 300ms ease-in-out
Slide: 250ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Rebuild Phases

### Phase 1: Booking Flow (4 components, 8 hours)
**User-facing booking pages** - High priority, core functionality

1. **pages/booking/index.vue** (2h)
   - Hero with services list
   - Service cards with hover effects
   - "Voir plus" pagination
   - CTA buttons

2. **pages/booking/[serviceId].vue** (2h)
   - Service details
   - Slot picker integration
   - Responsive layout

3. **components/booking/SlotPicker.vue** (2h)
   - Month calendar navigation
   - Day/time selection grid
   - Multi-step form progression
   - Animations: fade-in, slide-up

4. **components/booking/BookingForm.vue** (2h)
   - Contact form (name, email, phone)
   - Field validation
   - Submit handling
   - Error states

---

### Phase 2: Booking Confirmation (3 components, 4 hours)

5. **components/booking/ServiceCard.vue** (1h)
   - Service preview card
   - Duration/price display
   - Arrow hover effect

6. **pages/booking/confirm.vue** (1.5h)
   - Order summary
   - Date/time confirmation
   - Edit/cancel buttons
   - Progress indicator

7. **pages/booking/success.vue** (1.5h)
   - Success message
   - Confirmation details
   - Email info
   - Next steps

---

### Phase 3: Admin Dashboard & Auth (4 components, 6 hours)

8. **components/admin/Layout.vue** (2h)
   - Black sidebar (fixed)
   - Navigation menu with icons
   - User profile section
   - Mobile hamburger menu
   - Logout button

9. **pages/admin/index.vue** (2h)
   - Dashboard overview
   - Quick stats (total appointments, etc.)
   - Recent appointments list
   - Action buttons

10. **pages/admin/login.vue** (1h)
    - Auth form
    - Email/password inputs
    - Remember me checkbox
    - Centered layout

11. **components/shared/StatusBadge.vue** (1h)
    - Reusable badge component
    - Status colors (pending, confirmed, cancelled)
    - Icon + text

---

### Phase 4: Admin CRUD Pages (12 components, 16 hours)

#### Services Management (4 components, 4h)
12. **pages/admin/services/index.vue** (2h)
    - Services list with filters
    - Search functionality
    - Add/edit buttons
    - Delete with confirmation

13. **components/admin/ServiceForm.vue** (2h)
    - Form: name, description, duration, price
    - Toggle visibility
    - Input validation

#### Appointments Management (6 components, 8h)
14. **pages/admin/appointments/index.vue** (2h)
    - Appointments list
    - Filters (date, status, client)
    - Search
    - Sort options

15. **components/admin/AppointmentList.vue** (2h)
    - Paginated list view
    - Status indicators
    - Action buttons

16. **components/admin/AppointmentDetail.vue** (2h)
    - Full appointment details
    - Client info
    - Notes section
    - Status update buttons

17. **components/admin/AppointmentFilters.vue** (1h)
    - Filter form
    - Date range picker
    - Status checkboxes

18. **components/admin/AppointmentActions.vue** (1h)
    - Quick action buttons
    - Confirm/cancel/reschedule

#### Custom Fields (2 components, 2h)
19. **pages/admin/custom-fields/index.vue** (1h)
    - List existing fields
    - Add/edit buttons

20. **components/admin/CustomFieldForm.vue** (1h)
    - Field editor
    - Type selection (text, checkbox, etc.)

#### Exceptions Management (2 components, 2h)
21. **pages/admin/exceptions/index.vue** (1h)
    - Exceptions list

22. **components/admin/ExceptionForm.vue** (1h)
    - Date/time exception editor

---

### Phase 5: Admin Settings & Users (6 components, 8 hours)

23. **pages/admin/availability/index.vue** (2h)
    - Week availability editor
    - Time slot management
    - Add/remove slots

24. **components/admin/AvailabilityWeekEditor.vue** (2h)
    - Weekly grid with times
    - Drag-to-select enabled times

25. **pages/admin/email-templates/index.vue** (1h)
    - Email template list
    - Edit buttons

26. **pages/admin/settings/index.vue** (1h)
    - Settings form
    - Business info, hours, etc.

27. **components/admin/SettingsForm.vue** (1h)
    - Settings inputs

28. **pages/admin/users/index.vue** (1h)
    - Team members list
    - Add/remove users

---

### Phase 6: Advanced Components (2 components, 2 hours)

29. **components/booking/FieldRenderer.vue** (1h)
    - Dynamic form field renderer
    - Supports text, checkbox, select, etc.

30. **pages/appointment/[token].vue** (1h)
    - Appointment detail (public link)
    - Reschedule/cancel options

---

### Phase 7: Final Components (2 components, 2 hours)

31. **components/appointment/AppointmentCard.vue** (1h)
    - Card display for appointments
    - Status styling
    - Action buttons

32. **components/admin/ExceptionsList.vue** (1h)
    - Exceptions list view
    - Delete buttons

---

## Rebuild Timeline

| Phase | Components | Hours | Status |
|-------|-----------|-------|--------|
| 1: Booking Flow | 4 | 8 | 🟡 To Do |
| 2: Confirmation | 3 | 4 | 🟡 To Do |
| 3: Admin Core | 4 | 6 | 🟡 To Do |
| 4: CRUD Pages | 12 | 16 | 🟡 To Do |
| 5: Settings | 6 | 8 | 🟡 To Do |
| 6: Advanced | 2 | 2 | 🟡 To Do |
| 7: Final | 2 | 2 | 🟡 To Do |
| **TOTAL** | **32** | **46** | - |

---

## Git Strategy

**One commit per phase**
```bash
git commit -m "feat: Rebuild Phase 1 - Booking flow (HTML+Tailwind)

- Rebuild pages/booking/index.vue
- Rebuild pages/booking/[serviceId].vue
- Rebuild components/booking/SlotPicker.vue
- Rebuild components/booking/BookingForm.vue
- Custom SVG icons, Tailwind styling, CSS animations
- No Nuxt UI dependencies"

git push origin main
```

---

## Quality Checklist

- [ ] All components use Tailwind + scoped CSS
- [ ] No Nuxt UI imports
- [ ] All icons are inline SVG
- [ ] Animations smooth (60fps)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Forms validate properly
- [ ] Error handling graceful
- [ ] Accessibility WCAG 2.1
- [ ] Build succeeds (npm run build)
- [ ] No console errors

---

## Success Metrics

✅ 32 components rebuilt
✅ Premium Planity-inspired design
✅ Zero Nuxt UI dependencies
✅ Smooth animations throughout
✅ Fully responsive
✅ All tests passing
✅ Lighthouse 90+

---

**Status**: Ready to start Phase 1
**Next**: Begin Booking Flow pages
