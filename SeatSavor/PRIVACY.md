# SeatSavor — Privacy Rules (Demo)

SeatSavor is a portfolio showcase demo. It is **not** a real restaurant booking system.

## What SeatSavor does NOT do
- **No tracking.** No analytics, no advertising trackers, no third-party tracking scripts.
- **No advertising cookies.** The app sets no cookies for advertising. Theme, accessibility, and zoom-speed preferences are stored only in your own browser's `localStorage` (on your device, not sent to a server) and can be cleared by clearing site data.
- **No payments.** There is no payment flow, no card data, and no checkout.
- **No accounts.** There is no sign-up, sign-in, password, or user profile.
- **No sharing or selling.** Demo bookings are never shared with, or sold to, anyone.

## Demo bookings only
- `POST /api/bookings` stores a demo record **in server memory only**.
- It contains only what you type in the demo form: table, date, time, party size, and an optional demo name.
- It is **not a real reservation**. No restaurant is notified.
- It disappears when the server restarts.

## How to delete / reset demo data
- Click **"Clear demo bookings"** in the app, or
- `POST /api/bookings/reset`, or
- Restart the server (`Ctrl+C`, then `npm start` again).

## What is sent over the network
- The browser loads Three.js from a CDN (jsDelivr) so the 3D scene can render. That is the only external load in the frontend.
- API calls go only to the local Express server you run (`http://localhost:3000`).
- Do not enter real personal information, real phone numbers, real emails, or payment details into this demo.
