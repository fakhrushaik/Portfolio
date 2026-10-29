# ToothTown v2 — UX Cases

Each case is handled visibly in the UI, not silently.

- **Empty day:** Timeline columns and the calendar show “No bookings today / No appointments on [date]” plus a path to book. The Today KPIs show 0, not a blank.
- **No free slot:** The slot grid in step 4 counts free slots. When 0 are free, it shows a “No free slot” message and offers “Join waitlist for this date” instead of a submit button.
- **Double-booking attempt:** Submit and reschedule both run the same-doctor-or-room overlap check. On conflict the booking is not created, an error banner names the conflict, and the slot grid stays open so the next free slot can be picked.
- **Pending approval:** New bookings carry an amber pending badge, appear in the Today pending queue and in Approvals, and do not mark a room “in use” until approved.
- **Walk-in:** “Add walk-in to next free slot” on Today pre-fills step 4 with the next free OP1 / Dr John slot for today and still requires submit-for-approval. If no slot is free, it explains why and points to another operatory or the waitlist.
- **Cancel:** Cancel asks for confirmation, sets status to cancelled, frees the slot, and shows a red cancelled badge in history.
- **Reschedule:** Prompts for a new start time, recomputes the end time from the service duration, runs the conflict check, and blocks on conflict.
- **Waitlist:** Joining the waitlist stores a `waitlist` appointment for that date. It does not block slots and does not mark a room in use.
- **Search with no results:** Patient search shows “No results for …” with a prompt to try a different spelling or clear the search, instead of an empty table.
- **Mobile layout:** Below 860px the sidebar collapses behind a Menu button, KPI and timeline grids stack to two columns then one, and the floor plan scrolls horizontally inside its card. Touch targets are at least 36–44px, with visible keyboard focus throughout.
- **Accessibility:** Large text, high contrast, and reduce-motion toggles in Settings; rooms in the plan are keyboard-focusable buttons with aria labels; status is conveyed by text and badge, not colour alone.
- **In-use vs available:** A room is dark slate with white “IN USE” text only when it has an approved booking today. Pending bookings do not darken a room. Available rooms stay light in both light and dark app themes.
