# Studiora Year In Review

An interactive landing page featuring cursor-driven parallax and a 3D month card stack, built with GSAP animations.

## Features

- **Cursor Parallax**: Entire canvas pans opposite to cursor movement with a heavy, delayed feel
- **3D Card Stack**: Month cards with depth, blur, and scale progression
- **Smooth Animations**: GSAP-powered transitions with Lenis smooth scrolling
- **Responsive**: Works across screen sizes

## Quick Start

1. Open `index.html` in a browser

That's it - no build step required. All dependencies load from CDN.

## Local Development Server (Optional)

If you want to run a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
yearscroll/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── app.js          # GSAP animations and interactions
└── README.md       # This file
```

## Dependencies (CDN)

- [GSAP 3.12.5](https://greensock.com/gsap/) - Animation library
- [ScrollTrigger](https://greensock.com/scrolltrigger/) - Scroll-based animations
- [Observer](https://greensock.com/observer/) - Input detection
- [Lenis 1.1.18](https://github.com/darkroomengineering/lenis) - Smooth scrolling

## Controls

**Landing Page:**
- Move cursor to pan the background
- Click "Next" to enter the timeline

**Timeline:**
- Arrow keys (Left/Right) to navigate months
- Scroll wheel or trackpad to advance
- Click navigation buttons

## Customization

### Parallax Feel
In `app.js`, adjust the `initLandingParallax` function:
- `duration: 1.2` - Higher = heavier/slower feel
- `panRangeX/Y` - How far the canvas can move

### Card Stack Depth
In `app.js`, adjust `applyStackTransforms`:
- `scalePerStep` - Size reduction per card (0.12 = 12%)
- `offsetYPerStep` - Vertical stacking offset
- `blur` - Background card blur amount

## License

MIT
