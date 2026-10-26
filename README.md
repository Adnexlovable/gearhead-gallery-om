# GearHead Gallery

Build a premium automotive collector's gallery website called "GearHead Gallery" for a Muscat, Oman-based scale model car shop. Use a dark forest-green and gold luxury color palette (background #0B1D15 / #0E2219, gold accent #C9A84C, off-white text #EDE7DC, silver #B0B0B0). Use bold display typography for headlines and a mono font for labels/tags.

MOST IMPORTANT — HERO SECTION must be fully cinematic and 3D animated:
- Full-viewport hero with a looping background video (car/garage footage) with a cinematic letterbox gradient top and bottom and a dark radial color-grade overlay.
- On mouse move, the hero video/background should tilt subtly in 3D (perspective + rotateX/rotateY) following the cursor, like a parallax showroom display.
- On scroll, the video should slowly zoom in and parallax-shift while the headline text fades and slides up and out (scroll-scrubbed).
- Entrance animation on load: a staggered cinematic reveal — badge fades in, then headline lines slide up from below one by one, then subtitle, then CTA buttons, then stats — using smooth eased motion (power3/power4 easing, staggered).
- Headline: "GearHead GALLERY" in huge bold display type, with "Head" in italic gold gradient.
- Subtitle: "The Art of Automotive Passion"
- Badge pill: "Muscat, Oman · Est. 2024"
- Two CTA buttons: "Explore Collection" and "360° Experience" that smooth-scroll to sections.
- Stats row: 200+ Vehicles, 4 Categories, ∞ Passion.
- Bottom: animated scroll-down chevron hint, and a small "OMAN YELLOW PLATE" badge bottom-right.
- Use glassmorphism for badges/pills (frosted glass with subtle border).

OTHER SECTIONS (after hero):
1. Marquee band — scrolling ticker of car brand names.
2. Garage Scroll — horizontal/pinned scroll experience showcasing vehicles as you scroll, museum-style.
3. Video Sections — full-bleed video showcases with text overlays.
4. Gallery / "Automotive Museum" — filterable grid (All / F1 / Supercars / 4x4 Off-Road / Vintage Classics) of vehicle cards styled as museum vitrines: each card has museum lighting effect, glass-vitrine reflection overlay, scanline texture, 3D tilt-on-hover (mouse-tracked), a category badge, featured ribbon for the flagship item, vehicle image, make/year/title, short description, spec line (power/engine), and origin line. Include 8 sample vehicles across the 4 categories (Ferrari SF-24 F1, Mercedes-AMG W15 F1, Lamborghini Huracán Sterrato, Ferrari SF90 Stradale, Jeep Wrangler Rubicon 4xe — flagship/featured, Land Rover Defender 130 V8, Ferrari 250 GTO, Rolls-Royce Silver Ghost).
5. Framed Art — a "Shadow-Box Editions" section showcasing framed die-cast model car art pieces mounted top-down in lit shadow-boxes. Each card has mouse-tracked 3D tilt with a cursor-following glare/light reflection, a colored tag (e.g. "LIMITED SET", "GOLD EDITION", "BACKLIT · LED", "TRINITY SERIES"), title, subtitle, and expandable description on hover. Include 4 pieces: "The Dark Knight Rises" (Batmobile six-generation evolution display), "Land Rover Defender" gold edition, "BMW M3 Competition" illuminated LED vitrine, "Porsche 911 Trinity" (black/white/red triple display).
6. Shop — product grid for purchasing scale models / RC F1 cars / rally editions / framed art prints, with pricing.
7. Contact section with shop info (Muscat, Bausher location) and social links.
8. Footer.

Also include:
- A custom animated cursor that reacts to hoverable elements.
- A loading screen/preloader shown briefly on first load before the hero reveals.
- A sticky navbar with logo, links (Collection, Framed Art, Experience, Shop, Contact), that adds a glass background once scrolled, and a mobile hamburger menu.
- Smooth scroll-triggered fade/slide-up animations throughout every section (use scroll-triggered reveals consistently across the site, not just hero).
- Fully responsive for mobile.

Make this feel like a high-end automotive museum / luxury collector boutique website — cinematic, premium, dark and gold, with heavy use of 3D depth, parallax and mouse-interactive motion design, especially on the hero.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://agearheaddnex.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cca510c-833d-4854-8efc-7b20eaabdb7e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
