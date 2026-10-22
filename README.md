# EMBER & OAK — Contemporary Fine Dining (Concept Site)

A premium, production-quality fictional restaurant website built as Portfolio Project 01.

## Setup
No build step required. Open `index.html` in a browser, or serve locally:

```bash
cd ember-and-oak
python -m http.server 8080   # or npx serve .
```

Then visit `http://localhost:8080`.

## Features
- Single-page responsive landing page with anchor navigation.
- Cinematic hero with intentional composition, hero meta details.
- Editorial "Our Story" section with asymmetrical layout.
- Signature dishes gallery with subtle hover effects.
- Dining experience section with atmosphere copy.
- Functional menu category tabs (Starters / Mains / Desserts) with keyboard support.
- Culinary philosophy section.
- Reservation form with client-side validation and accessible error messages (demo only — no backend).
- Location/contact section with map placeholder, WhatsApp placeholder, directions CTA.
- Polished footer with navigation, contact, social placeholders.
- Subtle scroll-reveal animations respecting `prefers-reduced-motion`.
- Responsive layouts: mobile, tablet, desktop.
- Semantic HTML, accessible forms/navigation, focus indicators.

## Assets & dependencies
- Google Fonts: Cormorant Garamond, Manrope.
- Images: Unsplash photo IDs (see `index.html`), loaded responsively with lazy loading for below-the-fold.
- No JavaScript dependencies.

## Limitations
- All restaurant details (address, phone, hours) are fictional concept content.
- Reservation form is a front-end demo; submissions are not stored or transmitted.
- Map is a placeholder pending a real address.
- Social links are placeholders.
- Images remain subject to Unsplash license terms; verify before commercial use.

## Tests performed
- Static review of HTML structure and CSS responsiveness.
- JavaScript logic review (tabs, mobile nav, form validation).
- Reduced-motion behavior handled.
- No automated browser tests were run in this environment.
"# ember-oak-restaurant" 
