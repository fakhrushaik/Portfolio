# ToothTown v2 — Privacy

ToothTown v2 is a demonstration, not a clinical system.

- All staff names, patient names, appointments, and rooms are **fictional demo data**.
- There is no real patient health information in this project, in the seed data, or in the browser demo.
- On GitHub Pages, demo changes are stored only in the visitor's own browser (`localStorage`). Nothing is sent to a real clinic system.
- Locally, the Node API stores demo data in memory only; restarting the server reseeds it.
- There are no accounts, no payments, and no real authentication. Role switching in the UI and the `x-demo-role` header in the API are demo workflow aids only.
- **No certification claim is made.** In particular, this project does not claim HIPAA, GDPR, or any other compliance certification. The design choice to show patients only as rows/cards (never as figures in a 3D view) is a privacy-minded design choice, not a compliance guarantee.
- Do not enter real patient names, phone numbers, or health details into this demo.
