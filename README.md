# Alt-Tab Website

A multi-disciplinary think tank website built with React, Vite, and Tailwind CSS. Based in Nashville, TN.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vercel** - Deployment platform

## Getting Started

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

## Project Structure

```
src/
├── App.jsx          # Main application component (all pages and components)
├── main.jsx         # React entry point
└── index.css        # Tailwind CSS imports and global styles

public/              # Static assets
dist/                # Production build output
```

---

## Content Management Guide

All content is managed in `src/App.jsx`. Below are instructions for updating each dynamic section.

### Projects Page

Located in the `ProjectsPage` component (~line 783). Edit the `projects` array:

```javascript
const projects = [
  {
    title: 'Project Name',           // Display title
    category: 'Category Name',       // e.g., 'Digital Goods', 'Furniture', 'Web Design'
    size: 'large',                   // Options: 'small', 'medium', 'large'
    image: 'https://...'             // Image URL (Unsplash recommended)
  },
  // Add more projects...
];
```

**Image Size Guidelines:**
- `small`: 400x400px recommended
- `medium`: 600x400px recommended
- `large`: 800x600px recommended

**Using Unsplash Images:**
```
https://images.unsplash.com/photo-ID?w=WIDTH&h=HEIGHT&fit=crop
```

---

### Moodboards Page

Located in the `MoodboardsPage` component (~line 932). Edit the `moodboardImages` array:

```javascript
const moodboardImages = [
  {
    src: 'https://images.unsplash.com/...',  // Image URL
    alt: 'Image description',                 // Alt text (shows on hover)
    category: 'Category Name'                 // e.g., 'Skate Culture', 'Footwear', 'Art'
  },
  // Add more images...
];
```

**Best Practices:**
- Use square images (600x600px recommended)
- Add descriptive alt text for accessibility
- Group by category for visual coherence

---

### Shop Page

Located in the `ShopPage` component (~line 1053). Currently displays an "Under Construction" notice.

**To add products when ready:**

1. Create a `products` array similar to projects:

```javascript
const products = [
  {
    title: 'Product Name',
    price: 29.99,
    image: 'https://...',
    description: 'Short description',
    link: 'https://checkout-url.com'  // External checkout link
  },
];
```

2. Replace the construction notice with a product grid
3. Consider integrating with Shopify, Gumroad, or Stripe for payments

---

### News Links (Headlines)

Located at the top of the file (~line 8). Edit the `NEWS_LINKS` array:

```javascript
const NEWS_LINKS = [
  { title: 'SITE NAME', url: 'https://example.com' },
  // Add more links...
];
```

Links appear in the homepage sidebar in alphabetical order.

---

### World Clocks

Located in `HomePage` component (~line 695). Edit the clock array:

```javascript
{[
  { city: 'CITY NAME', tz: 'Timezone/Region' },
  // Examples:
  // { city: 'NASHVILLE', tz: 'America/Chicago' },
  // { city: 'LONDON', tz: 'Europe/London' },
  // { city: 'TOKYO', tz: 'Asia/Tokyo' },
].map((clock) => (
```

Find timezone strings at: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

---

## Static Pages

These pages require less frequent updates:

### Home Page
- Header branding and tagline (~line 665)
- About section tiles (~line 725)
- Navigation buttons (~line 747)

### About Page
- Philosophy cards (~line 994)
- Mission statement (~line 1036)
- Content is mostly static brand copy

---

## Customization

### Background Image

Edit line 5:
```javascript
const BACKGROUND_IMAGE = 'https://images.unsplash.com/...';
```

### Brand Colors

The site uses a yellow-orange gradient navbar. Key color classes:
- `bg-yellow-300`, `bg-yellow-400`, `bg-orange-400` - Navbar
- `bg-red-600` - Accent headers
- `bg-cyan-500` - Interactive elements

### Dark/Light Mode

Toggle is built-in. Dark mode uses light grays; default mode uses the background image with overlay.

---

## Deployment

The site is configured for Vercel deployment.

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**To deploy:**
1. Push changes to the repository
2. Vercel auto-deploys from connected branch
3. Preview deployments available for PRs

---

## SEO Considerations

For production, consider adding to `index.html`:

```html
<title>Alt-Tab | Multi-Disciplinary Think Tank | Nashville, TN</title>
<meta name="description" content="Alt-Tab is a multi-disciplinary think tank in Nashville, TN. We design human-centric experiences across digital goods, furniture, sportswear, and policy.">
<meta property="og:title" content="Alt-Tab Think Tank">
<meta property="og:description" content="Multi-disciplinary design studio in Nashville, TN">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">
<link rel="canonical" href="https://your-domain.com">
```

---

## Support

- Instagram: [@alttab.xyz](https://www.instagram.com/alttab.xyz/)
- Location: Eartth
- Founded: Yes
