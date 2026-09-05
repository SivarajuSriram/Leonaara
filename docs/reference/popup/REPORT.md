# Popup reference capture — `OnPageLeadCampaign` #10625

Captured 2026-09-05 against the live `https://www.eriro.at/en/` using a throwaway
Playwright script (`chromium.launch()`, not committed — one-time capture per Task 17's
brief, not app code). This replaces the Task-15-era capture that was lost, and is the
first capture ever to reach and document **step 2** of the form.

Every claim below is tagged:
- **CONFIRMED** — directly observed against the live site in this session.
- **REFINED** — the ledger's fact was directionally right but this capture found a
  more precise or partially different version of it.
- **NEW** — not previously documented at all.
- **UNVERIFIED** — could not be checked (documented so nobody assumes it was).

---

## 1. Verification of the already-known facts (spec §16.5 / HANDOFF.md §2 item 6)

| Fact (as carried forward, unverified, into this task) | Result |
|---|---|
| ADDITIVE `OnPageLeadCampaign`, id `10625` | **CONFIRMED.** `id="10625"` on both the outer wrapper and (oddly) its immediate child — see §2. |
| Plain `div#10625.aa-popup-modal-wrapper` | **CONFIRMED**, with the caveat that the CSS id selector `#10625` is invalid unless escaped (`#\31 0625` or `div[id="10625"]`) since it starts with a digit — worth knowing if Task 18 writes any CSS/JS that targets it by id string. |
| `z-index: 9999999` | **CONFIRMED** exactly, in both the raw stylesheet rule and computed style. |
| Fires 5s after page view | **CONFIRMED in spirit, REFINED in measurement.** Wall-clock time from `page.goto()` to the popup's `waitForSelector` resolving ranged **6.9s–10.9s** across 5 runs, not a flat 5s. This is expected: the timer almost certainly starts from the widget's own script init (its "page view" event), not from navigation start, and the difference is page-load overhead (DNS/TLS/asset download/hydration) before the widget's own JS even begins counting. Did not instrument the widget's internal timer directly, so the literal "5s" couldn't be isolated from load time — treat "roughly 5s after the page is interactive" as the safe restatement. |
| Closes only via ✕ (no Esc, no backdrop click) | **CONFIRMED** by direct test: pressed `Escape` with the popup open → still present. Clicked the backdrop at a point well outside the card → still present. Clicked the ✕ button → closed. |
| No exit animation | **CONFIRMED.** Polled the DOM every ~30ms after clicking ✕; the node was gone from the DOM within **2ms** of the click, with no interim opacity/transform change observed. Removal is instant, not a fade/scale-out. |
| Open animation: backdrop `rgba(0,0,0,0→.5)` 0.3s linear | **CONFIRMED exactly.** Captured the literal `@keyframes bZnkvn { 0% { background-color: rgba(0,0,0,0); } }` rule plus the wrapper's own `animation: 0.3s linear 0s 1 normal none running bZnkvn` and resting `background-color: rgba(0,0,0,0.5)`. Identical on both viewports (same keyframe name `bZnkvn` shared by desktop and mobile). |
| Open animation: card `scale(.9→1)` 0.5s `cubic-bezier(.85,1.5,.5,1)` | **CONFIRMED on desktop, REFINED for mobile.** Desktop: literal `@keyframes fGDMMo { 0% { transform: scale(0.9); } }`, animation `0.5s cubic-bezier(0.85, 1.5, 0.5, 1)`, ending at the card's own `transform: scale(1)`. **Mobile uses a different keyframe animating a different property** — `@keyframes bnzgFv { 0% { transform: translateY(20%); } }` — same duration and easing (`0.5s cubic-bezier(0.85, 1.5, 0.5, 1)`), but it slides up from `translateY(20%)` rather than scaling from `0.9`. The "already-known fact" only mentioned the scale version; the mobile variant is a separate, previously-undocumented animation using the same timing curve. |
| Mobile variant slides up as a bottom sheet | **CONFIRMED and precisely characterized** — see §5. |
| Scroll lock via inline `overflow:hidden` on `<html>` | **CONFIRMED, REFINED (more properties than just overflow).** The live `<html>` element's `style` attribute while the popup is open reads exactly: `overscroll-behavior: none; scroll-behavior: auto; overflow: hidden; padding-right: 0px;` — i.e. it also disables overscroll/rubber-banding and sets `scroll-behavior: auto` (overriding any smooth-scroll), and explicitly zeroes `padding-right` (the usual scrollbar-width compensation value, here always 0 rather than compensating for the removed scrollbar — may cause a small horizontal layout shift on desktop browsers with visible scrollbars; not chased further since it's the vendor widget's own quirk, not something to deliberately replicate pixel-for-pixel unless Task 18's scroll-lock utility already handles this generally). |
| Dismissal per-session via a cookie with a ~4h sliding expiry | **CONFIRMED, REFINED (exact mechanism found — this was the "exact cookie name unknown" gap).** See §6 — it is **not** a dedicated dismissal cookie; it's the pre-existing session cookie `additivemc_session_information`, and dismissal is encoded as a field added to that cookie's JSON payload. |

---

## 2. DOM structure — step 1

Full raw capture: `popup-step1-desktop.html` (1920×951) and `popup-step1-mobile.html`
(390×844). Screenshots: `screenshots/step1-desktop-1920x951.png`,
`screenshots/step1-mobile-390x844.png`.

Simplified structure (desktop; mobile is the same shape, different computed geometry):

```
div#10625.aa-popup-modal-wrapper          <- backdrop: fixed inset:0, flex-center, bg rgba(0,0,0,.5), z-index 9999999
  div#10625[dup id].sc-hBMWXB              <- the CARD: relative, 840px wide, bg #F4F2F1, radius 2px, shadow
    div.sc-ArhTS                           <- grid: [320px image row] [auto content row]
      div.sc-bBjRfo                        <- photo (background-image, cover, dark multiply overlay)
      div.sc-cOidAj                        <- scrollable content wrapper (overflow:auto)
        div.flex                            <- two-column flex row
          div (left, ~58%)                  <- heading + body copy
            "EUR150 Towards Your First Escape at eriro"   (42px/39.4px karol-sans 300)
            body paragraph                              (20px/26px)
          div (right, ~42%, form column)
            form
              label "Email" + input[name=email][type=email]
              "Show terms and conditions" accordion (collapsed, chevron icon)
                -> expands to a 4-item bullet list (see section 7)
              submit button "Claim Your EUR150 Welcome Gift" (envelope icon)
              "powered by ADDITIVE" logo link (opens additive.eu)
    div.sc-fFSQHq                          <- close-button slot, OUTSIDE the scroll area, top-right
      button[type=button] (X icon)
```

**Note the duplicate `id="10625"`**: both the outermost wrapper *and* its direct child
carry the same `id`/`size`/`visibility`/`content` attributes (visible verbatim in the
raw HTML files — these look like React/Vue props that leaked through as DOM attributes
rather than being consumed, e.g. `visibility="[object Object]"`). This is the vendor
widget's own bug/quirk, captured faithfully — do not "fix" it when hand-coding Task 18's
component, just don't reproduce the leaked-prop artifacts (there's no reason to literally
render `visibility="[object Object]"` as an attribute).

Step 1 form: **one field**, `input[name="email"][type="email"]`, placeholder/label
"Email". No other inputs on step 1.

---

## 3. DOM structure — step 2 (the actual point of this task)

Full raw capture: `popup-step2-desktop.html` (1920×951), `popup-step2-mobile.html`
(390×844). Screenshots: `screenshots/step2-desktop-1920x951.png`,
`screenshots/step2-mobile-390x844.png`. Reached by filling step 1's email field with
`popup-capture-test@example.com` and clicking the step-1 submit button.

Simplified structure (desktop):

```
div#10625.aa-popup-modal-wrapper
  div#10625.sc-hBMWXB                      <- same card, but now single-row grid (no photo -- see below)
    div.sc-ArhTS  (grid-template-rows: auto -- the 320px photo row is GONE on step 2)
      div.sc-cOidAj -> div (scrollable, height:auto now instead of 100%)
        div (header row)
          div[role=button] "<- Back"         <- returns to step 1 (not deep-tested, but present + clickable)
          div (progress block, right-aligned)
            "Step 2 of 2"      "100 %"      <- labels either side
            progress bar: 2 flex-1 segments, both currently full width (scaleX(1));
              the 2nd segment plays a 0.5s cubic-bezier(.4,0,.2,1) scaleX fill-in
              animation when step 2 mounts (own animation, separate from and in
              addition to the card-open animation in section 1 -- NEW finding, not previously
              documented; unrelated easing curve, don't confuse the two)
        form (2-column CSS grid on desktop: grid-template-columns: repeat(2,1fr))
          col 1: Salutation (select) -> Given name (input) -> Family name (input)
          col 2: Email (input, pre-filled from step 1) -> consent block -> submit button
          "powered by ADDITIVE" logo link
    div.sc-fFSQHq -> button[type=button] (X icon, same close button as step 1)
```

On mobile the same fields render in a single stacked column (see
`screenshots/step2-mobile-390x844.png`): Back / X header -> progress bar -> Salutation ->
Given name -> Family name -> Email -> terms/consent -> submit -> powered-by footer, all
full-width, in that order.

### 3.1 Step 2 fields, in full

| Field | Element | name | Required? | Notes |
|---|---|---|---|---|
| Salutation | `<select name="salutation">` | `salutation` | **No** (submitting with it left on the placeholder produced no validation error) | Options: `""` -> "Choose salutation" (placeholder, `class="is-placeholder"`), `"none"` -> "None", `"f"` -> "Ms.", `"m"` -> "Mr." |
| Given name | `<input name="givenName">` | `givenName` | **No** (left empty, submit still proceeded past this field with no error shown on it) | plain text, no `type` attribute (defaults to text) |
| Family name | `<input name="familyName">` | `familyName` | **No** | same as above |
| Email | `<input name="email" type="email">` | `email` | Carried forward from step 1, pre-filled and still editable | Same input styling/class as step 1's field |
| Terms and conditions | collapsible `<span>`/chevron + hidden `<ul>` | — | n/a, informational only | Identical 4-bullet list to step 1 (see section 7) |
| Consent checkbox | custom styled `div[role=checkbox]`-style control (`div[tabindex="0"]` driving a sibling checked-state div, not a native `<input type="checkbox">`) + label "I have acknowledged the [data protection regulations](https://www.eriro.at/en/privacy/)" | — | **Yes — the only required field on step 2** | See §3.2 for the validation behaviour observed |
| Submit | `<button>` "Claim Your €150 Welcome Gift" | — | — | Identical button/icon/copy to step 1's submit button |

### 3.2 Validation and submit behaviour — directly tested

- **Submitting step 2 with the consent checkbox unchecked** (given/family name left
  blank, salutation left on placeholder, only email carried over): the form did **not**
  advance. An inline red error message appeared immediately below the checkbox row:
  **"The privacy policy must be accepted"** (same red, `rgb(235, 90, 97)` / `#EB5A61`,
  used for the empty error-slot elements already present per-field in the DOM). No
  errors appeared for salutation/given/family name — confirming those three are
  optional; only the consent checkbox is enforced client-side.
  Screenshot: `screenshots/step2-missing-consent-1920x951.png`. Raw HTML at the moment
  of that error: `popup-step2-validation-error.html`.
- **Submitting step 2 fully filled and consented** (salutation "Ms.", given name
  "PopupCaptureTest", family name "DoNotContact", checkbox checked): the form
  **replaced its content with a third, previously-undocumented state** — a double
  opt-in confirmation screen, not a close or a redirect. See §4.

Both of these were tested against the **live** production widget, so two throwaway
leads (`popup-capture-test@example.com`, an RFC 2606 reserved example domain that
cannot receive real mail or belong to a real person) now exist in Additive's system for
campaign 10625. This was accepted as within the task's explicit one-time-capture
authorization; flagging for the record rather than treating it as a silent side effect.

---

## 4. NEW: the post-submit confirmation state (beyond the brief's "two steps")

Not requested by the brief (which scoped this to "the two-step form's second step"),
but discovered while testing step 2's submit behaviour and worth recording since it
changes what "submit behaviour" means for step 2 — the €150 code is **not** granted
immediately on submit. Raw HTML: `popup-success-state.html`. Screenshot:
`screenshots/step3-or-success-1920x951.png`.

Content: an icon (stacked lines + envelope), heading **"Almost done!"**, body text
*"Thank you for your registration. To complete your sign-up, please check your email
inbox and click the confirmation link in the email we sent you."* — no form, just the
✕ close button and the "powered by ADDITIVE" footer. This is a double-opt-in gate: the
real offer/voucher is presumably delivered only after the recipient clicks a
confirmation link in an actual email (**UNVERIFIED** beyond this point — capturing that
would require access to a real inbox, out of scope here).

**Recommendation for Task 18** (non-binding — Task 18 owns this decision): since no
real backend exists for this clone (spec's forms are validating stubs, §15), Task 18
should decide whether to model this third state at all, or stop at "step 2 submits →
popup closes / shows a lightweight stub thank-you," given there is no real double-opt-in
email pipeline to complete in this project.

---

## 5. Mobile bottom-sheet mechanics (both steps)

Confirmed via the mobile `.struct.json` geometry dumps and the matched CSS rules in
`mobile.css`:

- The **wrapper** (backdrop) is identical in mechanism to desktop: `position: fixed;
  inset: 0; display:flex; align-items:center; justify-content:center; background-color:
  rgba(0,0,0,.5); z-index: 9999999`.
- The **card** overrides the flex-centred position with an explicit absolute placement
  (this is what turns it into a bottom sheet): on mobile only, an extra, more specific
  rule is layered on top of the base card rule:
  ```css
  /* base (shared shape with desktop, before the mobile override) */
  .bEbRLu { /* ... */ position: relative; width: 840px; max-width: calc(100% - 48px);
    margin: 24px; border-radius: 2px; /* ... */ }
  /* mobile-specific override (this is what makes it a bottom sheet) */
  .bEbRLu.bEbRLu {
    position: absolute; top: 51px; bottom: auto; left: 0; right: 0;
    width: 100%; max-width: 100%; margin: 0;
    height: auto; max-height: max-content; min-height: fit-content;
    border-bottom-left-radius: 0; border-bottom-right-radius: 0;
  }
  ```
  Net effect: the card fills the full viewport width, is flush to the bottom
  (`bottom: 0` inherited from the wrapper's own inset since `bottom: auto` combined with
  `top: 51px` on an absolutely-positioned box whose containing block is the
  full-viewport wrapper stretches it down to the wrapper's own bottom edge), leaves a
  51px gap at the top (which is where the site's own fixed header — hamburger menu,
  REQUEST/BOOK links — remains visible, per the screenshots), and only the **top** two
  corners are rounded (2px) — the bottom corners are explicitly squared off since the
  sheet is flush with the viewport bottom.
- The **entrance animation** is `translateY(20%) → translateY(0)` over the same
  `0.5s cubic-bezier(0.85, 1.5, 0.5, 1)` curve as desktop's scale animation (see §1) —
  a slide-up, not a scale-up, on mobile.
- The **close button** also changes mechanism on mobile: desktop's is
  `position: fixed` with a translucent white background (`rgba(255,255,255,.4)`) and
  `backdrop-filter: blur(20px)` so it reads against the photo underneath it; mobile's is
  `position: sticky; top: 24px` with an **opaque** background matching the card colour
  (`rgb(244,242,241)`, no blur) — consistent with there being no photo directly behind
  it on the mobile step-2 layout, and with it needing to stick above scrolling form
  content on a tall, scrollable single-column sheet.
- This bottom-sheet shape and mechanism is identical between step 1 and step 2 on
  mobile — only the form content inside changes.

---

## 6. Dismissal cookie — exact mechanism (previously "cookie name unknown")

**Cookie name: `additivemc_session_information`** (domain `www.eriro.at`, path `/`).
This is **not** a dedicated "popup dismissed" cookie — it's the widget's general
session-tracking cookie, base64-encoded JSON, already set on first page load before the
popup even opens. Two other related cookies also exist but are not what governs
re-triggering:
- `additivemc_uuid` (domain `.eriro.at`) — a long-lived (~400 day) anonymous visitor id.
- `additivemc_session_uuid` (domain `www.eriro.at`) — same ~4h expiry as
  `additivemc_session_information`, a per-session id, not campaign-specific.

Decoded payload progression observed for `additivemc_session_information` (base64 →
JSON) across the flow, for the *same* browser session:

1. **On page load**, before the popup opens:
   ```json
   {"firstPage":"https://www.eriro.at/en/","referrer":"","acid":null}
   ```
2. **Once the popup has opened** (merely viewing it, not dismissing), a per-campaign
   UUID is registered:
   ```json
   {"firstPage":"...","referrer":"","acid":null,"ma_uuids":{"10625":"<uuid>"}}
   ```
3. **After clicking ✕ to close it**, a `pausedCampaigns` array is appended:
   ```json
   {"firstPage":"...","referrer":"","acid":null,"ma_uuids":{"10625":"<uuid>"},"pausedCampaigns":[10625]}
   ```

**Expiry is confirmed sliding**: every time this cookie is rewritten (page load, popup
open, popup close), its `Expires` is reset to **~4 hours from that moment** — measured
deltas across two separate test runs: 3.97h, 3.99h, 3.97h, 3.98h from write-time.

**Confirmed which state actually suppresses re-triggering** (two direct tests, both
fresh browser contexts):
- Open the popup, **do not** close it, reload the page → popup **reappears** (state 2
  above, `ma_uuids` alone, does **not** suppress re-triggering).
- Open the popup, close it via ✕ (state 3 above, `pausedCampaigns` written), reload the
  page → popup does **not** reappear within 8s (long enough for the ~5s-after-load
  trigger to have fired if it were going to).

So the precise rule: **only clicking ✕ writes `pausedCampaigns: [10625]`, and only that
field's presence in the cookie suppresses the auto-trigger** on subsequent page loads
within the cookie's ~4h sliding window. This is the concrete mechanism Task 18 should
replicate (e.g. a `localStorage`/cookie flag with the same ~4h TTL, set only on explicit
close, checked before scheduling the 5s auto-open timer) — it does not need to
replicate Additive's own cookie name, encoding, or the other two tracking cookies,
which are analytics/session plumbing unrelated to the visual/behavioural clone this
item asks for (consistent with spec §2's "trackers not cloned" non-goal).

---

## 7. Terms-and-conditions accordion (identical on both steps)

Both steps show the same collapsed-by-default accordion: an icon + "Show terms and
conditions" + chevron, which expands (not captured mid-transition, but the mechanism is
fully present in the captured CSS) via a CSS grid trick:

```css
.vUeHs { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s; }
.krZdYV { overflow: hidden; }
```

i.e. collapsed state is `grid-template-rows: 0fr` (zero-height row, clipped by the
inner `overflow:hidden` wrapper), and expansion is presumably a class/inline-style swap
to `1fr` animated by the same `grid-template-rows` transition (0.3s, no explicit easing
specified so it's the CSS default `ease`). Content revealed when expanded, verbatim:

> - Valid for your first stay only
> - Direct hotel bookings only
> - Minimum stay of 3 nights
> - Cannot be combined with other offers, discounts or vouchers

---

## 8. Colour, type and spacing tokens (exact, from captured rules — not computed approximations)

| Token | Value | Where used |
|---|---|---|
| Ink / primary text | `rgb(33,29,29)` = `#211D1D` | body text, borders-as-shadows, icon fills |
| Card background | `rgb(244,242,241)` = `#F4F2F1` | card, mobile close button bg |
| Button text / light | `rgb(245,244,242)` = `#F5F4F2` | submit/close button text & icon fill |
| Error red | `rgb(235,90,97)` = `#EB5A61` | error text, invalid-input ring |
| Success green (unused in this flow, present as a CSS variant) | `rgb(36,180,116)` = `#24B474` | `.success` button/close variant, not triggered by anything observed |
| Font family | `karol-sans` (weight 300 throughout — the same self-hosted font already used elsewhere in this project) | all popup text |
| Title | 42px / 39.4px line-height, 0.025em tracking | step 1 heading |
| Body copy | 20px / 26px, 0.05em tracking | step 1 paragraph, form inputs |
| Label / helper / error / terms text | 14px / 16px, 0.025em tracking | field labels, error slots, "powered by", terms bullets |
| Border radius | `2px` uniformly | card, buttons, inputs, close button |
| Card shadow | `0 4px 12px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.05)` | card only |
| Input background | `rgba(33,29,29,.05)`, focus ring `inset 0 0 0 1px rgba(33,29,29,.5)`, hover bg `rgba(33,29,29,.1)`, error ring `inset 0 0 0 1px #EB5A61` | all text inputs, select |
| Label opacity | `.62` (field labels) / `.5` (progress-bar labels, placeholder text) over the ink colour | — |
| Card desktop sizing | width 840px, `max-width: calc(100% - 80px)`, `max-height: 85%`, `margin: 40px` | desktop only |
| Step 2 grid (desktop) | `grid-template-columns: repeat(2, 1fr); gap: 4px 16px` with explicit `grid-area` placement per field | desktop step 2 only — collapses to a plain single column (`grid-template-columns: 1fr`) on mobile |

Background photo on step 1 is served from a third-party asset host,
`multimedia.additive-apps.tech`, with crop/adjustment query params (e.g.
`?bri=0&con=0&sat=0&amc=123&af=1&szp=848,320,...`) — this is the Additive widget's own
CDN, unrelated to the site's own Nuxt `_ipx` image pipeline (spec §16.7(a)). Task 18
should **not** fetch this URL live; substitute one of the project's own already-licensed
homepage photos for the card image, consistent with this project's existing
image-sourcing approach.

Full deduped rule/keyframe listing (real CSS syntax, not JSON): `desktop.css`,
`mobile.css`. These include every button/input state (hover/active/focus/error/loading/
success/outline variants) beyond what's summarized in the table above.

---

## 9. Files created under `docs/reference/popup/`

```
REPORT.md                          — this file
desktop.css                        — deduped, real CSS: every matched rule + both
                                      confirmed @keyframes, 1920×951 viewport (steps 1+2)
mobile.css                         — same, 390×844 viewport
popup-step1-desktop.html           — raw outerHTML of #10625, step 1, desktop
popup-step1-mobile.html            — raw outerHTML of #10625, step 1, mobile
popup-step2-desktop.html           — raw outerHTML of #10625, step 2, desktop
popup-step2-mobile.html            — raw outerHTML of #10625, step 2, mobile
popup-step2-validation-error.html  — step 2 mid-validation-error state (§3.2)
popup-success-state.html           — the post-submit double-opt-in confirmation state (§4)
screenshots/
  step1-desktop-1920x951.png       — required capture
  step1-mobile-390x844.png         — required capture
  step1-filled-desktop-1920x951.png / step1-filled-mobile-390x844.png
                                    — step 1 with the email field filled, pre-submit
  step2-desktop-1920x951.png       — required capture
  step2-mobile-390x844.png         — required capture
  step2-missing-consent-1920x951.png — validation error state (§3.2)
  step2-filled-1920x951.png        — step 2 fully filled, checkbox checked, pre-submit
  step3-or-success-1920x951.png    — the post-submit confirmation state (§4)
```

No files under `app/`, `components/`, `lib/`, or any existing test were touched — this
task is reference material only, per the plan's Global Constraints.

---

## 10. Open items / things Task 18 should know going in

- The mobile card-open animation is `translateY`, not `scale` — don't reuse desktop's
  scale-based CSS for mobile; use the axis/property documented in §1 and §5.
- Step 2 has **no photo** — its content grid is single-row (`auto`), unlike step 1's
  `320px auto`. Don't carry the photo through to step 2.
- Only the consent checkbox is required on step 2; salutation/given/family name are
  optional. Build validation accordingly.
- There is a third state (double opt-in confirmation) beyond the two form steps — see
  §4 for the recommendation to treat it as optional/out of scope given this project has
  no real email backend.
- The dismissal mechanism Task 18 needs to replicate is behavioural (a ~4h sliding
  "already dismissed this session" flag written only on explicit ✕ close, gating the
  5s auto-open timer) — not the vendor's literal cookie name/encoding, which is
  tracking plumbing outside this clone's scope.
- Styled-components class names (`sc-xxxxx`, and the trailing dynamic hash) are
  regenerated per page load/session and are **not stable** — `desktop.css`/`mobile.css`
  are useful for their literal property values, not as selectors to reuse verbatim.
