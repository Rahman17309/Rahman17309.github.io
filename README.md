# M A Rahman · Portfolio

Personal portfolio website: an original design built from scratch with plain HTML/CSS/JS, **Three.js** (3D "data terrain" hero) and **GSAP ScrollTrigger** (scroll animations). No build step.

- Live: https://rahman17309.github.io/
- Respects `prefers-reduced-motion`, keyboard-accessible, responsive down to 320px.

## Structure
```
index.html          page
css/style.css       styles and design tokens
js/hero.js          Three.js hero scene
js/main.js          nav, menu, copy-email, GSAP reveals
vendor/             three.js r170, GSAP 3.12
assets/             photo, resume, project images
```

## Run locally
```bash
python -m http.server 8000   # then open http://localhost:8000
```
