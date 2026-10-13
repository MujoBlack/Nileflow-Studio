# Nileflow Studio — Readdy AI build prompts

How to use this file:

1. Paste **Prompt 1** into Readdy as the very first message. It builds the whole site and the visual system.
2. Once you like the look, connect Supabase in Readdy and send **Prompt 2** (database and auth).
3. Send **Prompt 3** (booking flow and dashboard), then **Prompt 4** (emails with Resend).
4. Replace every `[BRACKETED]` value before sending.

Splitting the work this way works better than one giant prompt. Vibe-coding tools usually get the design right on the first pass and then lose detail when they also have to wire the backend in the same pass.

---

## Prompt 1: Site and design system (send first)

```
Build a premium, modern website for "Nileflow Studio", a professional music recording studio in [CITY, COUNTRY]. Artists, producers, podcasters and content creators book studio time online. The site must feel like a 2026 creative-tech brand (think Teenage Engineering meets Linear), not a generic template.

VISUAL DIRECTION
- Dark-first. Background near-black (#0A0A0B), surfaces #141416, hairline borders rgba(255,255,255,0.08).
- One signature accent inspired by the Nile at dusk: deep teal #14B8A6 to warm amber #F59E0B, used as a gradient only on key CTAs, the waveform and active states. Everything else is monochrome.
- Typography: a bold grotesk for headlines (e.g. "Space Grotesk" or "Clash Display"), very large and tight letter-spacing on hero text; "Inter" for body; a monospace (e.g. "JetBrains Mono") for small labels, prices, times and technical specs, written in uppercase with wide tracking.
- Subtle film grain overlay, soft glows behind accent elements, rounded-2xl cards, generous whitespace.
- Motion: smooth scroll-reveal fade-ups, an animated audio waveform / equalizer in the hero that reacts on hover, magnetic hover on primary buttons, marquee strip of artist names. Respect prefers-reduced-motion.
- Fully responsive and mobile-first. A sticky "Book a session" button sits at the bottom of the screen on mobile.

PAGES AND SECTIONS
1. Home
   - Hero: huge headline "Where sound flows." with a subline about the studio, two CTAs ("Book a session" primary, "Take the tour" secondary), and an animated waveform. A full-bleed background video/photo of the control room with a dark overlay.
   - Marquee of artists/clients who recorded here.
   - "Rooms" preview: 3 cards (Studio A – Live Room & Control Room, Studio B – Vocal Booth, Podcast Suite). Each card shows a photo, a short description, a "from [CURRENCY] [PRICE]/hr" label in mono and a "Book this room" button.
   - Services grid: Recording, Mixing, Mastering, Beat Production, Podcast Recording, Rehearsal. Each has an icon, a one-liner and a starting price.
   - "Listen" section: a custom dark audio player playlist of 4–6 tracks produced at the studio, with waveform progress, play/pause and track metadata.
   - Gear highlights: a horizontal scroll of key equipment (console, mics, monitors, outboard), in a spec-sheet style with mono labels.
   - How booking works: 3 steps (Pick a room & time → Pay deposit → Show up and create).
   - Testimonials from artists, with avatar, name and role.
   - FAQ accordion (cancellation policy, what to bring, engineer included?, parking, deposits).
   - Final CTA band with gradient and "Book your session".
   - Footer: address, Google Map embed, opening hours, WhatsApp link, Instagram/TikTok/YouTube/Spotify icons, newsletter email field.
2. Rooms – a detail page per room with gallery, specs, capacity, included gear, hourly rates and a booking CTA.
3. Services & Pricing – a pricing table with hourly rates, packages (e.g. "4-hour block", "Full day", "Mix + Master bundle") and add-ons (engineer, extra hour, stems export).
4. Gear – a full equipment list grouped by category, with a filter.
5. Portfolio – a grid of released projects with cover art and a Spotify/YouTube link.
6. About – the studio story, team/engineers with photos and roles.
7. Contact – a form (name, email, phone, message, project type), map, WhatsApp button.
8. Booking page (/book) – a multi-step booking flow:
   Step 1: choose room.
   Step 2: choose service + add-ons.
   Step 3: pick date on a calendar and an available time slot (show booked slots as disabled). Choose a duration in hours.
   Step 4: contact details (name, email, phone, artist/project name, notes).
   Step 5: summary with a live price breakdown, a deposit amount (30%) and a "Confirm booking" button.
   Then show a success screen with booking reference and "Add to calendar".
9. Auth pages – sign in / sign up (email + password and magic link), styled to match.
10. Client account (/account) – the client sees upcoming and past bookings, can cancel or reschedule (if more than 24h ahead), and can edit their profile.
11. Admin dashboard (/admin), only for admin users:
    - Sidebar layout (Linear/Vercel style) with Overview, Bookings, Calendar, Rooms, Services, Clients, Settings.
    - Overview: KPI cards (bookings this week, revenue this month, studio utilisation %, pending requests), a revenue line chart, and a list of today's sessions.
    - Bookings: a searchable/filterable table (status: pending, confirmed, completed, cancelled, no-show) with actions to confirm, cancel or mark completed, and a booking detail drawer.
    - Calendar: week view per room showing sessions as colour-coded blocks; click to view or edit. Admin can block out times (maintenance/private).
    - Rooms & Services: CRUD for rooms, services, prices and add-ons.
    - Clients: list of clients with booking history and total spend.
    - Settings: opening hours per weekday, minimum booking length, buffer between sessions, deposit percentage, cancellation window.

For now, use realistic mock data for everything so the whole UI is clickable. Use high-quality, moody studio photography (warm low light, analog gear, LED meters, artists at mics). Copy should be short, confident and creative, never corporate.

Tech: React + TypeScript + Tailwind CSS, clean reusable components, with the colours and fonts defined as design tokens in one place so they are easy to change later.
```

---

## Prompt 2: Supabase database and auth

Connect Supabase in Readdy first, then send:

```
Now connect the app to Supabase and replace the mock data with real data.

Create these tables with Row Level Security enabled:

- profiles: id (uuid, references auth.users), full_name, phone, artist_name, role ('client' | 'admin', default 'client'), created_at.
- rooms: id, slug, name, description, capacity, hourly_rate, images (text[]), specs (jsonb), is_active, sort_order.
- services: id, name, description, base_price, price_type ('hourly' | 'flat'), is_active.
- add_ons: id, name, price, price_type ('hourly' | 'flat'), is_active.
- bookings: id, reference (short human-readable, e.g. NF-4821), user_id (nullable, for guest bookings), room_id, service_id, start_time (timestamptz), end_time (timestamptz), status ('pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'), guest_name, guest_email, guest_phone, project_name, notes, subtotal, deposit_amount, total, payment_status ('unpaid' | 'deposit_paid' | 'paid'), created_at.
- booking_add_ons: booking_id, add_on_id, quantity, price.
- blocked_slots: id, room_id, start_time, end_time, reason.
- studio_settings: a single row holding opening_hours (jsonb per weekday), min_hours, buffer_minutes, deposit_percent, cancellation_hours, timezone.

Rules:
- Prevent double booking: add an exclusion constraint (btree_gist) on bookings so that for the same room_id, time ranges cannot overlap when status is 'pending' or 'confirmed'.
- RLS: anyone can read active rooms/services/add_ons and settings. Clients can read and insert their own bookings and update only to cancel them. Admins (profiles.role = 'admin') can read and write everything.
- Expose a Postgres function get_availability(room_id, date) that returns the free time slots for that day, taking opening hours, existing bookings, blocked_slots and the buffer into account. The booking calendar should use it.
- Auth: Supabase email+password and magic link. Create the profile row automatically on sign up with a trigger. Protect /account (logged-in) and /admin (admin only).
- Seed the rooms, services, add-ons and settings with the same content the mock data used.
```

---

## Prompt 3: Booking flow and dashboard wiring

```
Wire the booking flow and dashboards to Supabase:

- /book reads rooms/services/add-ons from the database, uses get_availability for time slots and calculates the price live (room rate × hours + service + add-ons, deposit = deposit_percent from settings).
- On confirm, insert the booking with status 'pending' and generate the reference. Handle the double-booking constraint error with a friendly "That slot was just taken, please pick another" message and refresh the slots.
- Guests can book without an account; if they're logged in, prefill their details and attach user_id.
- /account lists the user's bookings from Supabase with cancel/reschedule respecting cancellation_hours.
- /admin: all KPIs, charts, tables and the calendar read live data. Status changes, blocked slots, room/service CRUD and settings save to Supabase. Use Supabase Realtime so new bookings appear on the admin dashboard instantly with a toast.
- Add loading skeletons, empty states and error states everywhere.
```

---

## Prompt 4: Transactional emails with Resend

```
Add transactional email using Resend via a Supabase Edge Function called "send-email" (the RESEND_API_KEY is stored as a Supabase secret and never exposed to the browser). Sender: "Nileflow Studio <bookings@[YOURDOMAIN]>".

Send these emails, as clean dark-branded HTML templates matching the site (logo, gradient accent bar, booking summary table, CTA button):
1. Booking received (to client): reference, room, date/time, duration, price breakdown, deposit due, what to bring, cancellation policy.
2. New booking alert (to studio admin email [ADMIN_EMAIL]): with a link to the booking in /admin.
3. Booking confirmed (to client): when admin sets status to 'confirmed'. Include an .ics calendar attachment.
4. Booking cancelled (to client and admin).
5. Reminder 24 hours before the session (to client): use a scheduled Supabase cron job that calls the function.
6. Contact form submission (to admin) and an auto-reply to the sender.

Trigger the emails from the app after the relevant database actions (or from a database webhook on bookings inserts/updates). Log every send in an email_logs table (booking_id, type, to, status, created_at).
```

---

## Optional later prompts

- **Payments:** "Add deposit payment at step 5 using [Stripe / Paystack / Flutterwave], and mark payment_status = 'deposit_paid' through a webhook Edge Function." Pick the provider that supports your country and currency.
- **WhatsApp:** "Add a 'Send booking to WhatsApp' button on the success screen that opens wa.me/[NUMBER] with a prefilled message containing the reference."
- **SEO:** "Add meta tags, Open Graph images, a sitemap and LocalBusiness/MusicVenue JSON-LD schema with address and opening hours."

## Before shipping from Readdy to this repo

- Export the code from Readdy (or sync it to GitHub) into this repository.
- Keep `SUPABASE_URL` and the anon key in `.env`, and never commit the service-role key or the Resend key.
- Verify your sending domain in Resend (SPF/DKIM DNS records) or emails will land in spam.
- Double-check the RLS policies in the Supabase dashboard. AI-generated policies are the most common security gap.
