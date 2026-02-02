# Alt-Tab Website

A multi-disciplinary think tank website built with React, Vite, and Tailwind CSS. Based in Nashville, TN.

## Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing (URLs like /projects, /moodboards)
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
├── main.jsx         # React entry point with BrowserRouter
└── index.css        # Tailwind CSS imports and global styles

public/
├── images/          # Logo images (virginia-tech-logo.svg, lbf-logo.svg)
└── vite.svg

dist/                # Production build output
```

## URL Routing

The website uses React Router for client-side navigation. URLs are:

- `/` - Home page
- `/projects` - Projects page
- `/moodboards` - Moodboards page (YouTube videos)
- `/about` - About/Philosophy page
- `/shop` - Shop page

---

## How to Add a New Page

### Step 1: Create the Page Component

In `src/App.jsx`, add a new page component inside the `AltTabWebsite` component (before the `return` statement):

```javascript
const MyNewPage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Page Title</h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Page description here
        </p>
      </div>

      {/* Your page content */}
      <div>
        Content goes here
      </div>
    </div>
  );
};
```

### Step 2: Add the Route

Find the `<Routes>` section in App.jsx and add your new route:

```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/moodboards" element={<MoodboardsPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/shop" element={<ShopPage />} />
  <Route path="/mynewpage" element={<MyNewPage />} />  {/* Add this */}
</Routes>
```

### Step 3: Add Navigation Link

Find the `NavItem` components in the navigation section and add your new link:

```javascript
<NavItem icon={YourIcon} label="My Page" page="mynewpage" />
```

Import your icon from lucide-react at the top of the file:

```javascript
import { Menu, X, Sparkles, Grid3x3, Image, BookOpen, ShoppingBag, YourIcon } from 'lucide-react';
```

### Step 4: Test

1. Run `npm run dev`
2. Navigate to `http://localhost:5173/mynewpage`
3. Verify the URL changes and the page displays correctly

---

## Content Management Guide

All content is managed in `src/App.jsx`.

### Projects Page

Located in the `ProjectsPage` component. Edit the `projects` array:

```javascript
const projects = [
  {
    name: 'Project Name',
    logo: '/images/logo.svg',        // Local image in public/images/
    // OR
    logoText: 'TEXT',                // Text displayed as logo
    description: 'Short description',
    link: 'https://example.com'      // Optional: external link
  },
];
```

### Moodboards Page

Located in the `MoodboardsPage` component. Edit the `videos` array to add YouTube videos:

```javascript
const videos = [
  { id: 'YOUTUBE_VIDEO_ID', title: 'Video Title' },
];
```

To get the video ID, take the part after `v=` from a YouTube URL:
- URL: `https://www.youtube.com/watch?v=7IdoDJCssNk`
- ID: `7IdoDJCssNk`

### News Links (Homepage Sidebar)

Located at the top of the file. Edit the `NEWS_LINKS` array:

```javascript
const NEWS_LINKS = [
  { title: 'SITE NAME', url: 'https://example.com' },
];
```

---

## Deployment

The site is configured for Vercel with SPA routing support.

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

The `rewrites` configuration ensures that all routes (like /projects, /moodboards) work correctly by redirecting to index.html for client-side routing.

**To deploy:**
1. Push changes to the repository
2. Vercel auto-deploys from connected branch
3. Preview deployments available for PRs

---

## Adding Images

1. Add images to `public/images/`
2. Reference them with `/images/filename.svg` (note: starts with `/`)
3. For SVG logos, you can create them or use tools like Figma

---

## Support

- Instagram: [@alttab.xyz](https://www.instagram.com/alttab.xyz/)
- Location: Earth
- Founded: Yes
