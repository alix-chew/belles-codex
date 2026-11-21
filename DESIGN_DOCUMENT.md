# Blue Ocean Kopi & Co. Design Document

## 1. Project Summary

This project is a warm, modern, multi-page website for **Blue Ocean Kopi & Co.**, a neighbourhood plant-based cafe at **YKK Street in Singapore**.

The latest build follows the attached specification photo:

- Use Vite, React, and Tailwind CSS
- Build a cafe website with separate About, Menu, Contact, and Login pages
- Include a main banner with cafe name, tagline, and action button
- Include a home-page Menu Preview section with prices in Singapore dollars
- Include a Contact page with address and opening hours
- Include Supabase-powered customer, staff, manager, and owner login with email confirmation
- Require login before purchase requests
- Use grey, light blue, and green colours for the UI/UX
- Start a development server for preview

## 2. Tools Chosen and Why

### Vite

Vite is used as the development server and build tool.

Why it was chosen:

- Required by the assignment prompt
- Fast local preview with hot reload
- Simple project structure for a React website
- Generates an optimized production build in `dist/`

### React

React is used for the interface.

Why it was chosen:

- Required by the assignment prompt
- Keeps each page section as a reusable component
- Makes it easy to extend the website later with more pages or interactive features
- Allows the menu content to be stored as structured data instead of repeated HTML

### Tailwind CSS

Tailwind CSS is used for styling.

Why it was chosen:

- Required by the assignment prompt
- Good for building consistent layouts quickly
- Makes spacing, grid, typography, and responsive behaviour visible in the JSX
- Reduces the need for a large custom CSS file

### lucide-react

`lucide-react` is used for simple interface icons.

Why it was chosen:

- Clean icon style that fits the modern cafe UI
- Keeps icons consistent
- Avoids custom SVG drawing inside components

### Supabase Auth

Supabase Auth is used for the customer, staff, manager, and owner login flow.

Why it was chosen:

- Provides email/password sign-up and sign-in without building a custom auth server
- Supports email confirmation for new accounts
- Fits a Vite and React front end through the official `@supabase/supabase-js` client
- Supports login-gated purchase requests, table bookings, and owner-assigned staff/manager/owner records

### PDF-Derived Images

The older generated bitmap files were removed. The current site uses cropped images rendered from the assignment PDF and stored in `public/images/`.

Current image assets:

- `public/images/kopi-site-reference.png`
- `public/images/codex-build-reference.png`

Why:

- The user requested images reused from the PDF instead of generated bitmaps
- The assets are local and portable
- They visually connect the website to the assignment reference material

## 3. Current File Structure

```text
index.html
package.json
vite.config.js
src/
  App.jsx
  index.css
  lib/
    supabase.js
  main.jsx
public/
  images/
    kopi-site-reference.png
    codex-build-reference.png
scripts/
  extract_pdf_assets.py
.env.example
README.md
DESIGN_DOCUMENT.md
SUPABASE_SETUP.md
```

## 4. Brand Direction

Blue Ocean Kopi & Co. should feel:

- Warm
- Clean
- Modern
- Neighbourhood-based
- Plant-forward
- Easy to scan on mobile

The website should not feel like a heavy restaurant menu or a formal corporate page. It should feel like a welcoming Singapore cafe that happens to have a fresher, greener menu.

## 5. Colour Palette

The required palette from the attached photo is **grey, light blue, and green**. The implementation uses those colours as the main design system.

| Role | Colour | Hex | Usage |
| --- | --- | --- | --- |
| Page background | Ocean 50 | `#f3f8f8` | Soft light blue background |
| Section tint | Ocean 100 | `#dcebed` | Light blue panels and badges |
| Accent blue | Ocean 600 | `#326f7b` | Headers, brand highlights, dark contact section |
| Primary green | Leaf 700 | `#31533d` | Main call-to-action buttons |
| Secondary green | Leaf 500 | `#4f7a5c` | Button hover and plant-based accents |
| Text grey-blue | Stone Blue | `#657883` | Secondary text |
| Soft grey | Soft Grey | `#eef1ef` | Menu section background |
| Main text | Slate 900/950 | Tailwind slate | Headings and readable text |

Palette rules for future pages:

- Use light blue or soft grey for calm section backgrounds
- Use green for primary actions and plant-based signals
- Use dark ocean blue for strong brand sections
- Keep menu cards white for readability
- Do not introduce strong unrelated colours unless there is a clear purpose

## 6. Typography

The project uses the system sans-serif stack through Tailwind and browser defaults.

Typography choices:

- Large bold hero heading for immediate brand recognition
- Clear section headings
- Smaller uppercase labels for section categories
- Body text in grey-blue for softer readability
- Prices in bold pills so users can scan quickly

Future rule:

Use large display type only for page heroes. Use tighter, smaller headings inside cards and functional sections.

## 7. Layout and Pages

The website uses hash-based in-app pages:

1. Home
2. About
3. Menu
4. Contact
5. Login / Account

### Header

The header includes:

- Brand mark
- Cafe name
- Short descriptor
- Navigation links to separate pages
- Log In / Account action button

### Home Page

The home page includes:

- Main banner with cafe name, plant-based cafe positioning, and short value proposition
- Clear action button linking to the Menu page
- PDF-derived kopi/toast visual
- Menu preview cards

Preview cards link directly to the matching item on the Menu page.

### About Page

The About page explains the cafe as a modern plant-based neighbourhood cafe.

It includes three short feature cards:

- Plant-based
- Slow mornings
- YKK Street

### Menu Page

The required menu items are:

- Signature Kopi - `S$3.80`
- Kaya Toast Set - `S$6.90`
- Uncle's Laksa - `S$9.80`

Each item has:

- Name
- Price in Singapore dollars
- Preview image
- Short description
- Quantity field
- Order total
- Order button

Ordering lives on the Menu page. Guests who click to order are sent to the Login page. Signed-in customers can submit purchase requests to Supabase when the `orders` table exists.

### Contact Page

The Contact page includes:

- Address: YKK Street, Singapore
- Opening hours:
  - Mon-Fri: 7:30 AM - 8:30 PM
  - Sat-Sun: 8:00 AM - 9:00 PM

### Login / Account Page

The Login page uses Supabase Auth.

It includes:

- Create account / sign in mode switch
- Email and password fields
- Full name field for new customer accounts
- Email confirmation message after account creation
- Signed-in customer purchase panel
- Staff/manager/owner account panels only after the owner assigns those roles in Supabase

Supabase configuration is kept outside source code through Vite environment variables:

```env
VITE_SUPABASE_URL=https://zfchieymyntbmpiyixjo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key-here
```

The public key is intentionally not committed. Setup steps live in `SUPABASE_SETUP.md`.

## 8. Component Choices

The React app is split into logical components inside `src/App.jsx`:

- `Header`
- `Hero`
- `HomePage`
- `AboutPage`
- `InfoCard`
- `MenuPreview`
- `MenuPage`
- `ContactPage`
- `LoginPage`
- `AccountPanel`

This keeps the project easy to read while avoiding too many files for a small assignment website.

Comments are used only where they help:

- To explain that menu data is structured for reuse
- To explain PDF-derived image usage

## 9. Extending Future Pages

To add more pages later:

1. Keep Vite, React, and Tailwind as the main stack.
2. Add new pages as React components and route them through the hash router.
3. Reuse the same colour tokens and spacing rhythm.
4. Keep prices in bold pills for menu-like content.
5. Use green for the main action.
6. Use light blue or soft grey for section backgrounds.
7. Put reusable data such as menu items into arrays.
8. Keep local images under `public/images/`.
9. Keep Supabase keys in `.env.local`, not in committed files.

Suggested future pages:

- Catering page
- Plant-based ingredient story
- Loyalty page
- Payment integration
- Booking form
- Customer order history
- Staff order dashboard
- Manager operations dashboard
- Owner settings dashboard

## 10. QA Notes

Verified on 21 November 2026:

- Dependencies installed with `pnpm`
- Vite production build passed
- React app compiled successfully
- Tailwind CSS compiled through `@tailwindcss/vite`
- Supabase client added through `@supabase/supabase-js`
- Menu page handles login-gated purchase requests
- PDF-derived images were used instead of generated bitmaps
- Old bitmap generator and generated BMP assets were removed

Build command:

```bash
pnpm build
```

Result:

```text
vite v8.3.8 building client environment for production...
built successfully
```

