# MARC – Malayalee Association of Reading Community

Official website for **MARC (Malayalee Association of Reading Community)**, a vibrant community of Malayalee families based in Reading, United Kingdom.  
The website showcases MARC’s story, values, events, community initiatives, and committee members.

🌐 Live site: https://marcreading.co.uk

---

## About MARC

MARC brings together Malayalee families in and around Reading to:

- Celebrate cultural traditions and festivals
- Strengthen community bonds
- Encourage youth participation and leadership
- Promote sports, social, and awareness activities
- Support meaningful connections among families

The website serves as a central platform to communicate MARC’s activities, events, and community values.

---

## Features

- **Responsive design** (mobile, tablet, desktop)
- **Smooth scroll navigation** between sections
- **Community-focused content** (Who We Are, What We Do, Events)
- **Samithi (Committee) members section** with photos and roles
- **Events listing** with images and details
- **Sponsorship & contact information**
- **SEO & social sharing optimized** (Open Graph, Twitter cards)

---

## Pages & Sections

- **Home** – Welcome message, featured video
- **About / Our Story** – MARC background, vision, and values
- **What We Do** – Cultural, social, youth, and sports activities
- **Community Values** – Unity, inclusivity, culture, and connection
- **Events** – Upcoming and past community events
- **Samithi Members** – MARC committee (2025–2026)
- **Contact & Sponsorships** – Enquiries and partnership details

---

## Tech Stack

- **HTML5**, **CSS3** (one custom stylesheet, no framework)
- **Vanilla JavaScript** (no jQuery / Bootstrap JS)
- **Bootstrap Icons** (icon font only)
- **Google Fonts** – Outfit, Plus Jakarta Sans, Anek Malayalam

No backend, database or build step is required — this is a **static website**.

---

## Design

Modern Kerala-themed design drawn from the MARC logo: backwater green, marigold and Kathakali red,
with a pookalam (flower carpet) motif drawn by JavaScript (loader, hero, backgrounds, 404) and a
chundan vallam (snake boat) in the footer. Colours and fonts are CSS variables at the top of
`static/css/marc.css`.

## Previewing locally

```bash
python3 tools/serve.py        # http://localhost:8000/
```

Links have no `.html` (`/about`, `/events`), which GitHub Pages serves automatically. The plain
`python3 -m http.server` does not, and it never shows `404.html`, so use the script above.

## Adding an event

In `events.html`, copy one `<article class="event">` block and set `data-date="YYYY-MM-DD"`.
The page works out from that date whether the event is **Upcoming** or **Past**, sorts the list and
fills in the filter counts. Event detail pages use `data-event-date` on `<main>` in the same way to
hide booking buttons once the event has passed.

---

## Project Structure

```text
/
├── index.html                    # Home page
├── about.html                    # Our Story, current Samithi, Samithi history
├── events.html                   # All events with Upcoming / Past filter
├── badminton-detail.html         # MARC Open Badminton Tournament
├── entrepreneurship-detail.html  # Inspire Entrepreneurship
├── videos.html                   # Latest YouTube video + all videos from @marc-reading
├── contact.html                  # Contact + Partnership & Sponsorship
├── 404.html                      # Not-found page (served automatically by GitHub Pages)
├── sitemap.xml / robots.txt
├── tools/serve.py                # Local preview server (clean URLs + 404 page)
├── static/
│   ├── css/
│   │   ├── marc.css              # Site styles
│   │   └── bootstrap-icons.css
│   ├── js/
│   │   └── marc.js               # Loader, menu, pookalam, petals, events filter, lightbox
│   ├── fonts/                    # Bootstrap Icons font
│   └── images/
│       ├── hero/                 # Web-sized page banners
│       ├── photos/               # "Kerala roots, Reading home" tiles
│       ├── members/              # Samithi member photos
│       ├── sponsors/
│       └── events/               # Event images, speakers, gallery thumbs
├── old-design/                   # Archived previous design (see its README)
└── README.md
```
