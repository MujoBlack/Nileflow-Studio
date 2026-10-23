# Nile Flow House — Project Plan

## 1. Project Description
Nile Flow House is a small independent music recording and production studio in an attic in Zurich, Switzerland. One studio room (production desk, two monitors, MIDI keyboard, vocal microphone corner with acoustic panels, guitar + amp) plus a sofa lounge for artists and guests.

- Target users: singers, rappers, producers, songwriters, voiceover artists, small podcasters.
- Core value: book a session online in under a minute.
- Tone: calm, clean, easy to navigate. Dark, minimal, one teal accent. Not flashy.

## 2. Page Structure
- `/` - Home (hero, studio tour, why us, sessions, services, recent work, team, reviews, FAQ, final CTA)
- `/services` - Services (5 groups: Recording, Production, Editing, Mixing & Mastering, Audio for Film & Video)
- `/studio` - The Studio (gallery, what it's good for, gear list, lounge, rates, house rules)
- `/work` - Work (releases grid with role + Spotify/YouTube links)
- `/team` - Team (engineers & producers, session players)
- `/about` - About (story + studio values)
- `/contact` - Contact (form, WhatsApp, map, "Finding us" block)
- `/quote` - Get a quote (detailed project form)
- `/book` - Booking flow (5 steps + success screen) — most important page
- `/signin` - Sign in / Sign up (email + password, magic link)
- `/account` - My bookings (upcoming/past, cancel/reschedule, edit profile)
- `/admin` - Admin dashboard (Overview, Bookings, Calendar, Quotes, Services & Prices, Clients, Settings)

## 3. Core Features
- [ ] Public marketing site with shared navbar + footer + mobile sticky "Book a session" bar
- [ ] Session-type cards deep-link into `/book?session=<id>` with the session preselected
- [ ] Multi-step booking flow: session type → date/time/duration → extras → details → review → success
- [ ] Price engine: hours × rate + extras = total, 30% deposit, remaining balance
- [ ] Booking reference (NF-1234), add-to-calendar (Google + .ics), send to WhatsApp, "what to bring"
- [ ] Sign in / sign up with email + password and magic link (UI, demo)
- [ ] My bookings: upcoming/past, cancel/reschedule gated to >48 hours before start, edit profile
- [ ] Admin dashboard with sidebar and overview/booking/calendar/quote/client views
- [ ] Contact form + Get-a-quote form (via built-in Form capability)
- [ ] Scroll reveal motion (fade-up) with prefers-reduced-motion respected

## 4. Data Model Design
Phase 1 uses realistic mock data (src/mocks). When the backend is connected, planned tables:

### Table: sessions (services catalogue)
| Field | Type | Description |
|-------|------|-------------|
| id | text | slug (vocal, production, podcast, dry-hire) |
| name | text | display name |
| price_per_hour | int | CHF per hour |
| description | text | one-line explanation |

### Table: bookings
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | primary key |
| reference | text | NF-1234 |
| session_id | text | FK to sessions |
| start_at | timestamptz | session start |
| duration_hours | int | 2/3/4/6/8 |
| extras | jsonb | selected extras |
| total | int | CHF total |
| deposit | int | 30% due now |
| status | text | confirmed/cancelled/completed |
| customer_name / email / phone / project | text | details |

### Table: quotes
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | primary key |
| service | text | requested service |
| songs_or_minutes | text | scope |
| deadline | date | requested deadline |
| files_link / reference_links | text | links |
| budget_range | text | budget band |
| message | text | notes |

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | FK auth.users |
| full_name | text | name |
| phone | text | phone |
| role | text | user/admin |

## 5. Backend / Third-party Integration Plan
- Database: not connected now — using temporary demo data (user choice). Booking, auth and admin are fully clickable but not persisted yet. Readdy Backend (recommended) or SaaS Supabase can be connected later.
- Payments: designed but not active. The booking flow is built so a card payment for the 30% deposit can be plugged in later (Stripe / Toss / PayPal / Square).
- Forms: Contact + Get a quote use the built-in Form capability.
- Shopify / others: not needed.

## 6. Development Phase Plan

### Phase 1: Design foundation + navigation + Home page
- Goal: Lock the design system and shared chrome, then build the Home page.
- Deliverable: design tokens (colours/fonts/spacing/radii/motion), Tailwind theme, global styles, Navbar, Footer, mobile sticky "Book a session" bar, reusable Button/SectionHeading/Reveal, and the full Home page with all 10 sections.
- Home visual direction (Stagevoo-style poster layout): Phudu 700–800 for all headings + hero, Inter for body, teal accent on the last words of each heading, centred section headings, pill buttons with a ↗ arrow.
- Layout: 1384px content shell (32px side padding on desktop, 24px tablet, 16px phone), body copy capped at 640px, full-bleed hero/marquee/footer wordmark.
- Scroll-driven sections: pinned Reviews (one review per 100vh, placed after the gallery), plus two light scroll-linked (never pinned) drifts — the horizontal "Frames from the room" strip that sits before Reviews, and the masked photo columns either side of the final CTA. All fall back to normal tabs / a swipeable row / a static photo strip below 768px and with prefers-reduced-motion.

### Phase 2: Public pages
- Goal: Build the informational pages.
- Deliverable: Services, The Studio, Work, Team, About.

### Phase 3: Contact + Quotes
- Goal: Lead capture.
- Deliverable: Contact page (form, WhatsApp, map, Finding us) and Get a quote page (full form).

### Phase 4: Booking flow
- Goal: The most important page.
- Deliverable: 5-step booking flow with progress bar, sticky summary panel, price engine, success screen, calendar + WhatsApp hand-off.

### Phase 5: Auth + My bookings
- Goal: Accounts.
- Deliverable: Sign in / sign up (password + magic link), My bookings (cancel/reschedule rules, profile edit).

### Phase 6: Admin dashboard
- Goal: Studio management.
- Deliverable: Admin layout with sidebar and Overview/Bookings/Calendar/Quotes/Services & Prices/Clients/Settings views on mock data.