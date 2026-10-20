# Quick customization notes

## Update the business information
Open `config.js` in TextEdit (choose Format → Make Plain Text if needed) or a code editor, then edit the values for bakery name, tagline, email, phone, location, and social links.

## Update the menu and listed prices
Open `app.js` and search for `const FLAVORS` to change cookie names and descriptions. Search for `const OFFERS` to change box and lemonade offerings/prices. The Sample Box is set to quote-by-inquiry because no price was provided; add a price there only when you decide one. Only box and gallon prices are shown because individual cookie prices weren't provided.

## Replace the logo
The supplied logo is saved as `assets/cookies-and-lemonade-logo.svg` and used in both the header and footer. Replace that SVG file to update the logo while keeping the same placement.

## Replace sample photographs
The image URLs are independent sample photography—not the reference screenshot. Replace those URLs with your own image URLs or local paths such as `assets/my-cookie-photo.jpg`. If you copy photos into `assets/`, update the relevant `image` values in `app.js` and `src` values in `index.html`.

## Test an order
Add one of the cookie boxes or lemonade gallons, select one or more cookie flavor preferences, then fill out the order inquiry. The form makes a preview that you can copy or open in your email app. Nothing is sent automatically and there is no payment checkout.

## Before you publish
Confirm the contact details, service area, pricing, allergen wording and ordering notice. Replace sample reviews with real customer feedback or remove them. Add your true social links when available.
