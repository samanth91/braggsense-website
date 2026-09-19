# braggsense.com

Static marketing site for **BraggSense Technologies Pty Ltd**, plus the live **WT-04 blade optical-fibre monitor** under `/demo/`.

Built to deploy on **GitHub Pages** with the custom domain `braggsense.com`. No build step.

## Local preview

```bash
cd braggsense.com
python3 -m http.server 4173
```

Open http://localhost:4173

## GitHub Pages

1. Create a public repo (recommended name: `braggsense.com` or `braggsense`).
2. Push this folder to `main`.
3. Settings → Pages → Deploy from branch `main` / root (`/`).
4. The `CNAME` file already contains `braggsense.com`.
5. At your DNS host, add:
   - `A` records for `@` to GitHub Pages IPs, or
   - `CNAME` for `www` → `<user>.github.io`
6. In the repo Pages settings, confirm the custom domain and enable HTTPS.

`.nojekyll` is included so GitHub does not process the site as Jekyll (needed for folders that start with `_` and for raw static files).

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

The contact form opens a `mailto:` to `nagulapallysamanth@gmail.com` so it works on GitHub Pages. To use Formspree later, set the form `action` to your Formspree endpoint.

## Demo data

`/demo/` is the Blade Optical Fibre Monitor: 4 blades × 8 fibres, driven by `blade-data.json` (downsampled from the laboratory `bladedata.csv`).
