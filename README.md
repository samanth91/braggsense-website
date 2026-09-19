# braggsense.com

Static marketing site for **BraggSense Technologies Pty Ltd**, plus the live **WT-04 blade optical-fibre monitor** under `/demo/`.

Live now: https://samanth91.github.io/braggsense-website/

The previous Next.js site is preserved on the `old-nextjs` branch.

## Local preview

```bash
python3 -m http.server 4173
```

Open http://localhost:4173

## GitHub Pages

This repo deploys from `main` / root. No build step.

### Custom domain (braggsense.com)

When DNS is ready:

1. Add a `CNAME` file on `main` containing `braggsense.com`
2. In the repo: Settings → Pages → Custom domain → `braggsense.com` → HTTPS
3. At the DNS host:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | samanth91.github.io |

## Site map

| Path | Page |
|---|---|
| `/` | Home |
| `/technology.html` | FBG technology |
| `/solutions.html` | Wind, civil, rail, aerospace |
| `/products.html` | Sensors, interrogators, software |
| `/platform.html` | BraggSoft |
| `/company.html` | Company |
| `/contact.html` | Enquiry (mailto) |
| `/demo/` | Live 4-blade mill monitor |

## Contact

The contact form opens a `mailto:` to `nagulapallysamanth@gmail.com` so it works on GitHub Pages.
