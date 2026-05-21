/**
 * Glazair Partner Portal — Analytics endpoint (Google Apps Script)
 *
 * Deploy as a Web App:
 *   Extensions → Apps Script → Deploy → New deployment
 *   Type: Web app | Execute as: Me | Who has access: Anyone
 *
 * Set SHEET_ID to the Google Sheet that receives events.
 * Sheet1 columns: timestamp | token_id | lang | event | section_id | duration_seconds | from_lang | to_lang | cta
 *
 * After deployment, copy the Web App URL into partners/.env as:
 *   VITE_ANALYTICS_ENDPOINT=https://script.google.com/macros/s/.../exec
 * and add it as a build secret in your CI / Cloudflare Pages environment.
 */

var SHEET_ID = '1yNMg5d1iofwvo_K_wL63bMPfWAvQ7PDaNSPivgjETjM'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

// ---------------------------------------------------------------------------
// POST handler — append one row per event
//
// The portal sends application/x-www-form-urlencoded (a CORS simple request,
// no preflight). The JSON event payload is nested inside a "payload" field.
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
function doPost(e) {
  try {
    // Parse application/x-www-form-urlencoded body.
    // Avoids URLSearchParams / Object.fromEntries which are not available in
    // every Apps Script runtime version.
    var raw        = e && e.postData && e.postData.contents ? e.postData.contents : ''
    var payloadStr = '{}'
    var pairs      = raw.split('&')
    for (var i = 0; i < pairs.length; i++) {
      var eq = pairs[i].indexOf('=')
      if (eq > -1 && decodeURIComponent(pairs[i].slice(0, eq)) === 'payload') {
        payloadStr = decodeURIComponent(pairs[i].slice(eq + 1).replace(/\+/g, ' '))
        break
      }
    }
    var data = JSON.parse(payloadStr)

    var ss = SpreadsheetApp.openById(SHEET_ID)
    var sheet = ss.getSheetByName('Sheet1') || ss.getActiveSheet()

    // Ensure header row exists on first write
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'timestamp',
        'token_id',
        'lang',
        'event',
        'section_id',
        'duration_seconds',
        'from_lang',
        'to_lang',
        'cta',
      ])
    }

    var timestamp = new Date().toISOString()

    var row = [
      timestamp,
      data.token_id          !== undefined ? String(data.token_id)          : '',
      data.lang              !== undefined ? String(data.lang)              : '',
      data.event             !== undefined ? String(data.event)             : '',
      data.section_id        !== undefined ? String(data.section_id)        : '',
      data.duration_seconds  !== undefined ? Number(data.duration_seconds)  : '',
      data.from_lang         !== undefined ? String(data.from_lang)         : '',
      data.to_lang           !== undefined ? String(data.to_lang)           : '',
      data.cta               !== undefined ? String(data.cta)               : '',
    ]

    // Sheet row is always written first — it is the authoritative record
    sheet.appendRow(row)

    // Email notification for CTA clicks
    if (data.event === 'cta_click') {
      try {
        var tokenId = data.token_id ? String(data.token_id) : '(unknown)'
        var cta     = data.cta      ? String(data.cta)      : '(unknown)'
        var lang    = data.lang     ? String(data.lang)     : '(unknown)'

        var subject = 'Portal CTA — Token ' + tokenId + ' — Action ' + cta
        var body = [
          'Token ID: '  + tokenId,
          'Language: '  + lang,
          'Action: '    + cta + '  (1 = agreement, 2 = questions, 3 = declined)',
          'Timestamp: ' + timestamp,
        ].join('\n')

        GmailApp.sendEmail('hello@glazair.com', subject, body)
      } catch (emailErr) {
        console.error('sendEmail failed: ' + String(emailErr))
        // Row already written — continue and return ok
      }
    }

    return jsonOutput({ ok: true })
  } catch (err) {
    // Always return 200 so the portal's fire-and-forget fetch doesn't error
    return jsonOutput({ ok: false, error: String(err) })
  }
}
