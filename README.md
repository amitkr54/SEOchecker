# AuditBreeze

A modern, fast, and free collection of SEO tools built with Vite and Vanilla JavaScript.

## 🚀 Features

- **Schema Markup Validator** - Validate JSON-LD structured data
- **Core Web Vitals Checker** - Analyze website performance with Google's API
- **Image Alt Text Checker** - Scan HTML for missing alt attributes

## 🛠️ Tech Stack

- **Vite** - Lightning-fast build tool
- **Vanilla JavaScript** - No framework overhead
- **Modern CSS** - Glassmorphism, dark mode, responsive design
- **Google APIs** - PageSpeed Insights integration

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
auditbreeze/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── AdUnit.js
│   │   └── ToolCard.js
│   ├── tools/             # Individual SEO tools
│   │   ├── schema-validator/
│   │   ├── core-web-vitals/
│   │   └── alt-text-checker/
│   ├── styles/
│   │   └── main.css       # Design system
│   └── utils/
│       └── common.js      # Shared utilities
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── index.html             # Homepage
└── vite.config.js         # Multi-page config
```

## 🎨 Design System

The project uses a comprehensive design system with:
- CSS custom properties for theming
- Dark mode by default
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive (mobile-first)

## 💰 Monetization

- Google AdSense integration ready
- Strategic ad placements on all pages
- Banner, rectangle, and responsive ad units

## 📝 Adding New Tools

1. Copy the tool template from `/src/tools/_template/`
2. Update HTML title, description, and meta tags
3. Implement tool-specific logic in `script.js`
4. Add tool to navigation in `Header.js`
5. Add tool card to homepage `main.js`
6. Update `vite.config.js` with new entry point
7. Update `sitemap.xml`

## 🔧 Configuration

### Vite Config
The project uses Vite's multi-page app configuration. All tool pages are defined as separate entry points in `vite.config.js`.

### Google AdSense
To activate AdSense:
1. Get approved by Google AdSense
2. Update ad slot IDs in `AdUnit.js`
3. Replace placeholder publisher ID

## 📊 SEO Optimization

All pages include:
- Unique titles and meta descriptions
- Open Graph tags for social sharing
- Schema.org structured data
- XML sitemap
- robots.txt
- Semantic HTML

## 🚀 Deployment

### Build
```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

### Hosting Options
- **Cloudflare Pages** (recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**

Simply upload the `dist/` folder to your hosting provider.

## 📈 Performance

- Lighthouse score: 90+ across all metrics
- Fast initial load (<3s)
- Optimized assets
- Code splitting per tool

## 🤝 Contributing

Feel free to add more SEO tools! Follow the structure in existing tools for consistency.

## 📄 License

MIT License - feel free to use for your projects!

## 🎯 Roadmap

- [ ] Robots.txt Validator
- [ ] Redirect Chain Checker
- [ ] SSL/HTTPS Checker
- [ ] Sitemap Generator
- [ ] Hreflang Tag Checker
- [ ] Meta Tag Analyzer
- [ ] Heading Structure Checker
- [ ] Canonical URL Checker

---

Built with ❤️ by AuditBreeze
