# Bookings Workspace Chunk

This chunk replaces the placeholder Bookings tab inside the new Admin Command Center.

## Commits

- `bd44a2cc9c9d3b2dee3992b3d610f8657a20b1c7`
- `005d6aabf573871073cd413cf0a60f597e19b890`

## Files

- `src/components/admin/BookingsWorkspace.jsx`
- `src/pages/AdminCommandCenter.jsx`

## Purpose

Adds a real operational bookings workspace to the replacement admin portal.

Includes:

- Needs Review queue
- Unassigned queue
- Upcoming queue
- Completed queue
- All Active queue
- Booking search
- Booking detail panel
- Service-area status visibility
- Provider assignment visibility

## Rollback risk

Low to medium.

This is wired into the new `/admin` command center shell, but it does not delete the old dashboard or old booking components.

## Still needed

- Booking action buttons
- Provider assignment screen
- Schedule adjustment screen
- Checkout screen
- Activity history
- Better mobile detail behavior
