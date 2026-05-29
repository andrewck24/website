<a name="readme-top"></a>

<div align="center">

# andrewck24 / website

[![Live Site][live-badge]][live-url]
[![LinkedIn][linkedin-badge]][linkedin-url]

A personal portfolio and technical blog — built with Next.js 16, Sanity CMS headless content management, and native View Transition API for app-like page transitions.

[live-url]: https://andrewck24.vercel.app/
[live-url-en]: https://andrewck24.vercel.app/en
[linkedin-url]: https://linkedin.com/in/andrewck24/
[live-badge]: https://img.shields.io/badge/Live%20Site-andrewck24.vercel.app-black?style=for-the-badge&logo=vercel
[linkedin-badge]: https://img.shields.io/badge/LinkedIn-ANDREW%20LI--WEI%20TSENG-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white

</div>

---

<details>
<summary>Table of Contents</summary>

- [About the Project](#about-the-project)
- [Highlights](#highlights)
- [Built With](#built-with)
- [Source Tree](#source-tree)
- [Getting Started](#getting-started)
- [License](#license)

</details>

---

## About the Project

[![Preview][preview-img]][live-url]

[preview-img]: ./public/images/preview.png

A full-stack personal portfolio website and a multilingual technical blog, designed for performance, content flexibility, and native-feeling navigation.

<div align="right"><a href="#readme-top">↑ back to top</a></div>

---

## Highlights

### Sanity CMS — Decoupled Content Management

Articles, project descriptions, and profile data are managed through [Sanity Studio][live-url-en] embedded at `/studio`. Content is fetched via `@sanity/client` using GROQ queries, and pages are revalidated on-demand via a Sanity webhook — eliminating the need for full rebuilds when content changes. This decoupling lets the site stay fully static by default while remaining editable in real time.

### View Transition API — Native-Like Page Navigation

Page transitions use the browser-native [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) rather than a JavaScript animation library. This produces hardware-accelerated, OS-level transitions (cross-fade and shared element) that match the feel of a native app, with zero animation runtime overhead. The implementation targets `next/link` navigation and degrades gracefully in unsupported browsers.

<div align="right"><a href="#readme-top">↑ back to top</a></div>

---

## Built With

[![Next.js][nextjs-badge]][nextjs-url]
[![TypeScript][ts-badge]][ts-url]
[![Tailwind CSS][tailwind-badge]][tailwind-url]
[![Sanity][sanity-badge]][sanity-url]

[nextjs-badge]: https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js
[nextjs-url]: https://nextjs.org/
[ts-badge]: https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org/
[tailwind-badge]: https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[sanity-badge]: https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white
[sanity-url]: https://www.sanity.io/

<div align="right"><a href="#readme-top">↑ back to top</a></div>

---

## Source Tree

```
src/
├── app/                   # Next.js App Router — routes, layouts, global styles
│   ├── (site)/[lang]/     # i18n route segment (zh-TW / en / ja)
│   ├── api/               # Route Handlers (Sanity webhook revalidation, etc.)
│   └── studio/            # Embedded Sanity Studio
├── assets/
│   └── fonts/             # Local font files loaded via next/font
├── components/            # React Server / Client components, grouped by domain
│   ├── about/
│   ├── article/
│   ├── home/
│   ├── icons/
│   ├── layout/
│   ├── mdx/
│   ├── projects/
│   └── ui/                # Shared primitives (Shadcn/ui)
├── lib/                   # Pure utilities and data-fetching helpers
│   ├── data/              # Static data (resume, nav links)
│   └── sanity/            # Sanity client, GROQ queries, schema helpers
└── types/                 # TypeScript type definitions and ambient declarations
docs/                      # Specs, Change artifacts
```

<div align="right"><a href="#readme-top">↑ back to top</a></div>

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v11+

### Installation

```bash
git clone https://github.com/andrewck24/website.git
cd website
pnpm install
```

### Environment Variables

Create a `.env.local` file at the project root and set the following variables:

```
NEXT_PUBLIC_APP_URL=
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=
```

Then start the dev server:

```bash
pnpm dev
```

<div align="right"><a href="#readme-top">↑ back to top</a></div>

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

<div align="right"><a href="#readme-top">↑ back to top</a></div>
