# Wedding Invitation — Agustin & Ahmad Arifin

Mobile-first wedding invitation for 17 July 2027.

## Files
- `index.html` — page structure/content
- `style.css` — Korean Elegant visual design
- `script.js` — countdown, Google Calendar, RSVP, wishes, music
- `assets/` — supplied photos and music
- `google-apps-script/Code.gs` — Google Sheets endpoint

## Google Sheets
Expected header row:
`Timestamp | Nama | Kehadiran | Ucapan`

## Google Apps Script
The project uses the Web App URL in `script.js` as `appsScriptUrl`.

After editing `Code.gs`, create a new deployment version:
Deploy → Manage deployments → Edit → New version → Deploy.

Keep:
- Execute as: Me
- Who has access: Anyone

## GitHub Pages
1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. Open Settings → Pages.
4. Select Deploy from a branch.
5. Select the main branch and `/root`.
6. Save and wait for GitHub Pages to publish.

## Editing wedding details
Most editable website data is in `script.js` under `CONFIG`.
Visible wording/content is in `index.html`.

## RSVP test
The current Apps Script was tested with a dummy entry. Delete the `Test Wedding` row from the sheet before sharing the invitation publicly.
