# Server Deploy Guide

**বাংলা-প্রধান**, ইংরেজি সহ দ্বিভাষিক ওয়েব গাইড — VPS এ অ্যাপ ডেপ্লয় (ম্যানুয়াল PM2/সিস্টেম সার্ভিস **অথবা** ডকার পথ): SSH, সিকিউরিটি, ডাটাবেস, Nginx, SSL, Cloudflare, মনিটরিং, CI/CD, ব্যাকআপ ও আরও অনেক কিছু।

**English:** A bilingual, interactive deployment guide with **manual** and **Docker** paths, dark/light theme, and language toggle (বাংলা / EN).

---

## Live site & source

| | Link |
| --- | --- |
| **Production** | [https://server-deploy.mdrakib.me](https://server-deploy.mdrakib.me) |
| **Repository** | [github.com/rakibislam2233/server-deploy-guide](https://github.com/rakibislam2233/server-deploy-guide) |
| **Contributors** | [/contributors](https://server-deploy.mdrakib.me/contributors) (when `NEXT_PUBLIC_GITHUB_REPO` is set) |

---

## Highlights

- **Content-driven guide** — Sections live in `src/lib/content/part0.ts` … `part4.ts`; each block has `bn` and `en` fields.
- **Two deploy paths** — Switch between manual (host PM2/services) and Docker; the visible sections update with your choice.
- **Reading progress** — Scroll-based progress and section checklist in the sidebar (large screens).
- **GitHub integration** — Repo link, optional **star count** in the header (via `/api/github-repo`), and contributors fetched from the GitHub API.
- **SEO-ready** — `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph + Twitter cards, JSON-LD (`WebSite` / `Organization`), and [`opengraph-image`](./src/app/opengraph-image.tsx).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, React 19) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (Base UI primitives) |
| Fonts | [Anek Bangla](https://fonts.google.com/specimen/Anek+Bangla) (Bengali), Quicksand, IBM Plex Mono |
| Tooling | TypeScript, ESLint, Turbopack (`next dev` / `next build`) |

---

## Prerequisites

- **Node.js** 18 or newer  
- **npm** (or pnpm / yarn)

---

## Getting started

```bash
git clone https://github.com/rakibislam2233/server-deploy-guide.git
cd server-deploy-guide
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
For production-like checks:

```bash
npm run build
npm run start
```

---

## Environment variables

Copy `.env.local.example` to `.env.local` and set values for your fork / deployment.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_GITHUB_REPO` | Recommended | GitHub repo as **`owner/repo`** only (e.g. `rakibislam2233/server-deploy-guide`). Powers repo links, contributors page, star count API, and JSON-LD `sameAs`. Full `https://github.com/...` URLs are normalized when possible. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site origin **without** trailing slash, e.g. `https://server-deploy.mdrakib.me`. Used for metadata base, canonical URLs, `sitemap.xml`, `robots.txt`, and social previews. |
| `GITHUB_TOKEN` | Optional | Fine-grained or classic PAT for higher GitHub API rate limits on `/api/github-repo`. **Server-only** — do not use `NEXT_PUBLIC_` prefix. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification string. |
| `NEXT_PUBLIC_TWITTER_SITE` | Optional | Twitter / X handle for `site` meta (e.g. `@yourhandle`). |
| `NEXT_PUBLIC_TWITTER_CREATOR` | Optional | Creator handle for Twitter card metadata. |

---

## npm scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |

---

## Project layout (short)

```
src/
  app/                 # Routes, layout, SEO (sitemap, robots, OG image), API routes
  components/          # UI: guide shell, header, sidebar, contributors view, etc.
  contexts/            # Theme, language, deploy path (localStorage)
  hooks/
  lib/
    content/           # Guide data: part0.ts … part4.ts
    i18n/              # UI strings (bn / en)
    seo.ts             # Site URL helpers & keywords
  types/               # Guide TypeScript types
```

---

## Contributing

We welcome fixes and improvements. Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:

- Fork / clone / PR flow (বাংলা ও English)
- Where content files live and how nodes are structured
- What to run before opening a PR (`npx tsc --noEmit`, `npm run dev`)

---

## License

If the repository includes a `LICENSE` file, follow that file. Otherwise, default to the terms stated by the repository owner on GitHub

---

## Author

Maintained by **[Rakib Islam](https://github.com/rakibislam2233)** — questions and suggestions via [Issues](https://github.com/rakibislam2233/server-deploy-guide/issues).
