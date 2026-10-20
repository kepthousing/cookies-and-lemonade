# Cookies & Lemonade — Cozy Bakery Website

A responsive, cottagecore-inspired website for Cookies & Lemonade, using the warm styling of the first draft: vanilla backgrounds, chocolate-brown type, caramel and peach accents, elegant serif headlines, handwritten accents, photo frames, tiny doodles, and gentle interactions.

**No photos, design elements, colors, layout, or illustrations from the business-information screenshot are used.** The screenshot was used only to transfer business facts and text. Preview photography is pulled from external Unsplash URLs; there are built-in local cookie-illustration fallbacks if a photo cannot load.

## Run it on a Mac

1. Download the ZIP and double-click it to extract the folder.
2. Open the `cookies-and-lemonade-cozy` folder.
3. Double-click `index.html` to open it in Safari or Chrome.
4. Internet access is needed for the sample photography and Google Fonts. The page layout and interactions still work locally without them.

Your supplied logo is used in the header and footer from `assets/cookies-and-lemonade-logo.svg`. No install, framework, package manager, or build step is required. If your browser's clipboard support is limited when opening a local file, the inquiry text will be selected so it can be copied manually.

## What's interactive

- Responsive navigation with a mobile menu.
- Smooth section links and gentle scroll-reveal animations, with reduced-motion support.
- Cookie cards with expandable details and selectable flavor preferences.
- Lemonade-by-the-gallon options with listed prices.
- Four box options with listed prices, quantity controls, and automatic subtotal calculation.
- A Sample Box inquiry option below the packages; its price is intentionally left for confirmation.
- An order inquiry builder for cookie boxes, lemonade, catering, large orders, and special requests.
- Copyable inquiry text and an optional `mailto:` draft; nothing is automatically submitted, sent, paid for, or stored on a server.
- A clickable photo gallery lightbox, accessible FAQ accordions, keyboard focus styling, and subtle pointer response in the hero.

## Business details currently entered

These values were copied from the information in the supplied screenshot. Confirm the email, phone, service area, menu and allergen text before publishing:

- Bakery: Cookies & Lemonade
- Phone: 919-438-1403
- Email: customerservice@cookiesandlemonade.com
- Area: Austin, TX · Service area
- Cookies: Chocolate Chip, Oatmeal Raisin, Red Velvet, Sugar Cookie
- Lemonade: Original $12/gallon; Cucumber, Strawberry, and Peach $14/gallon
- Cookie boxes: Dozen Box $40 (12 cookies); Gift Box $45 (12 cookies, ribbon and card); Party Box $76 (24 cookies); Crowd Box $144 (48 cookies)
- Notice: 2 business days for cookie orders; 1 week for events and larger orders
- Allergen wording: contains wheat, milk, eggs, and soy; kitchen uses nuts; vegan options available on request; products made in a home kitchen may contain common allergens

## Customize

### Contact details and social links
Open `config.js`. Update `email`, `phoneDisplay`, `phoneLink`, `location`, `instagramUrl`, and `tiktokUrl`. Leave social links blank until you have the final URLs; they show a gentle reminder rather than opening a fake profile. If you want to use an outside ordering page, add its full `https://` address to `orderUrl`.

### Cookies, lemonade and prices
Open `app.js`:

- `FLAVORS` controls cookie names, descriptions, optional detail copy, and sample image URLs. There are no per-cookie prices because those weren't stated in the business information; price is shown only for the box options with known prices.
- `OFFERS` controls box and lemonade items/prices. It includes the listed prices currently copied from the reference information.

### Photos
Sample photos are remote image URLs in `app.js` and `index.html`. Replace them with your own uploaded photos when available, or replace the remote URLs with local files stored under `assets/`. No picture from the supplied screenshot is included in this project.

### Your story and testimonials
The story copy is gentle starter text rather than personal facts. Edit it to reflect your actual journey. The customer quotes are clearly marked placeholders and should be replaced by genuine customer feedback or removed before publishing.

## Important order limitations

This is a static website and an inquiry builder, not a live checkout or order-management service. The price subtotal adds only listed box and lemonade items and does not include tax, delivery, catering/custom quotes, or availability. A customer can copy the inquiry or open their email app with a prefilled draft addressed to the business; they must review and send it themselves. No payment is taken, and no inquiry is submitted to a server.

Confirm all business details and local food requirements before publishing.

## Files

- `index.html` — page content and structure
- `styles.css` — visual style, responsive layout, and animation
- `app.js` — product data and interactions
- `config.js` — business name, contact and link settings
- `assets/` — favicon and local fallback illustration
