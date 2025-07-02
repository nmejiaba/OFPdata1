# OFP Extractor

This GitHub-hosted site lets you upload a flight plan PDF and extracts:
- WX FORECAST
- NOTAMS
- FIR NOTAMS
- Alternate airport data

It sends the structured result to a specific Google Sheet tab via a Google Apps Script WebApp.

## Setup
1. Deploy the Google Apps Script WebApp that writes to your Google Sheet.
2. Replace `YOUR_GAS_WEBAPP_URL` in `script.js` with the WebApp URL.
3. Host this repo on GitHub Pages.

Enjoy!
