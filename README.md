# Abuela Latin Food — Website

A modern, highly interactive **3-page catering website** for **Abuela Latin Food** — homemade Latin food catering (pernil, carne mechada, Latin lasagna) serving Burlington & the Greater Toronto Area.

Built as a fast, self-contained static site (no build step, no framework) engineered for **lead capture / growth**.

---

## Pages

| Page | File | Purpose |
|------|------|---------|
| **Home** | `index.html` | Brand story, signature dishes, testimonials, gallery, CTAs |
| **Menu** | `menu.html` | Full menu with live category filtering (Mains / Handhelds / Sides / Sweets) |
| **Catering** | `catering.html` | Packages, event types, **interactive quote builder**, FAQ, contact |

### Interactive features
- Sticky glass header that hides on scroll-down / reveals on scroll-up
- Scroll-reveal animations + animated stat counters
- Infinite dish marquee
- Testimonial carousel (autoplay, dots, arrows)
- Menu category filtering
- Photo lightbox gallery
- FAQ accordion
- **Multi-step quote builder** with a live price estimate (guest slider × package) that hands off to WhatsApp on submit — works with **zero backend**
- Floating WhatsApp button, back-to-top, toast notifications
- Fully responsive + `prefers-reduced-motion` support

---

## Run locally

It's plain HTML/CSS/JS — just open `index.html`, or serve the folder:

```bash
# Python
python -m http.server 5178
# then visit http://localhost:5178

# or Node
npx serve .
```

---

## Customize

### 1. Contact details
Business phone, WhatsApp and email live in **`js/main.js`** at the top:

```js
const CONFIG = {
  whatsapp: "16479726553",          // digits only, full international
  email:    "hello@abuelalatinfood.com",
  endpoint: ""                       // optional — see "Form delivery" below
};
```

Phone / address / links also appear in each page's header, footer, and the
JSON-LD SEO block in `index.html`. Search-and-replace if they change.

### 2. Form delivery (the quote builder)
Out of the box, submitting the quote form opens **WhatsApp** with the request
pre-filled — no server required. To *also* push leads to a CRM or inbox, set
`CONFIG.endpoint` to a POST URL (e.g. a [Formspree](https://formspree.io) form
or your own webhook). It's sent as JSON and fails silently, so WhatsApp still works.

### 3. Photos
The dishes use hand-drawn **SVG illustrations** in `assets/dishes/` so the site
looks polished with no stock-photo risk. To use real food photos, drop them in
an `images/` folder and swap the `<img src="assets/dishes/...svg">` tags (and the
`.dish-media` / `.menu-card-media` backgrounds) for your JPGs.

### 4. Placeholder content to confirm
These are realistic **samples** — update with the owner's real info before going live:
- **Menu prices** (per-tray estimates) in `menu.html` and package prices in `catering.html`
- **Testimonials** in `index.html` (replace with real guest reviews)
- **Email address** and **Facebook link** (currently placeholders)

---

## Deploy

Any static host works. Recommended:

- **Vercel** — import the GitHub repo → deploy (no settings needed)
- **Netlify** — drag-and-drop the folder or connect the repo
- **GitHub Pages** — Settings → Pages → deploy from `main` / root

No environment variables required unless you add a form `endpoint`.

---

## Structure

```
.
├── index.html          # Home
├── menu.html           # Menu (with filtering)
├── catering.html       # Catering + quote builder + FAQ
├── css/styles.css      # Full design system
├── js/main.js          # All interactions (feature-detected, shared)
└── assets/
    ├── logo.svg · favicon.svg · papel-picado.svg
    └── dishes/         # SVG dish illustrations
```

Made with ❤️ & sabor.
