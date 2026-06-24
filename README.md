# Portfolio

Personal portfolio website and playground for graphics-related experiments.

The main goal of this repository is to host interactive demos built with Three.js and related web graphics technologies
The portfolio itself acts as an entry point that provides information about the projects and links to individual demos

## Features

* Portfolio website
* Interactive graphics demos
* Project pages with descriptions and technical notes
* Static deployment via GitHub Pages
* Modular structure for adding new projects over time

## Technologies

* Vue 3
* TypeScript
* Vite
* Three.js
* Tailwind CSS
* DaisyUI

## Demos

The repository is intended to grow over time. Current and planned demos cover areas such as:

* Rendering techniques
* Shader experiments
* An apartment visualisation
* WebGPU exploration
* Visualization tools
* Product configuration
* Performance testing
* Interactive 3D experiences

Each demo is designed to be as independent as possible while sharing common infrastructure where it makes sense.

### Folder structure
- 📁 `public/` - 3d assets
- 📁 `src/` - Source files
  - 📁 `assets/` - Web assets
    - 📁 `images/` - Images
    - 📁 `styles/` - Styles
        - 📁 `vendor/` - Vendor styles (Tailwind CSS, DaisyUI)
  - 📁 `demos/` - Demo related code
  - 📁 `components/` - Vue components
  - 📁 `router/` - Vue Router configuration
  - 📁 `views/` - Vue views
  - 📄 `App.vue` - Root component
  - 📄 `main.js` - Entry point

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

### GitHub Pages

There's a GitHub workflow for deployment to GitHub Pages. To enable GitHub Pages:

1. Visit your repository's Settings
2. Select the Pages section
3. In the "Build and deployment" area, set the source to "GitHub Actions"

