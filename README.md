# LOVEMEAFTER — Shopify Theme

LOVEMEAFTER is a premium women's lingerie, swim, and fashion brand — *"For the hours after."*
This repository is a real Shopify Online Store 2.0 theme, built on the Dawn architecture
(Liquid sections/snippets, JSON templates, section schemas, blocks) and customized to the
approved LOVEMEAFTER design.

This is a production theme, not an HTML prototype. It is built to be uploaded directly to a
Shopify store via the Shopify CLI or the theme library.

## Build status

This theme is being built in phases against an approved developer handoff. Current status:

- ✅ **Foundation** — valid Online Store 2.0 document shell (`layout/theme.liquid`), LOVEMEAFTER
  color tokens and typography wired into `config/settings_schema.json` / `settings_data.json`,
  unrelated legacy content removed.
- 🚧 **Homepage & editorial sections** (hero, Shop by World, editorial split, video grid, social
  grid, newsletter) — in progress.
- 🚧 **Product, collection, cart, and search experience restyle** — in progress.

This README will be filled in with final section/customization documentation as each part ships.

## Typography

- **Headlines (serif):** Playfair Display — set via the theme's Typography settings
  (`type_header_font`).
- **UI / body (sans):** System Helvetica stack — set via `type_body_font`.

Both are changeable in **Theme Settings → Typography** without touching code.

## Color tokens

Defined as Shopify color schemes in **Theme Settings → Colors**, and as a standalone
**Accent color** setting used for the newsletter section, cart free-shipping progress bar,
and sale/accent CTAs:

| Token | Hex | Scheme |
|---|---|---|
| Near-black (ink) | `#14100D` | scheme-4 — header (solid state), footer, dark sections |
| Warm ivory | `#F3ECE2` | scheme-1 — page background, light text on dark |
| Muted border / hairline | `#E4D8CA` | scheme-2 — subtle card/section variant |
| Espresso | `#3C2A1F` | scheme-3 — alternate dark accent |
| Oxblood / deep cherry | `#5A1F22` | scheme-5 + Accent color setting |

## Development

This theme uses the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) for local
development and deployment:

```sh
shopify theme dev      # local preview against a connected store
shopify theme check    # lint the theme
shopify theme push     # upload to a store (only when explicitly instructed)
```

## Architecture

Standard Online Store 2.0 structure:

```
assets/      compiled CSS/JS, icons, theme images
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     translations
sections/    reusable, theme-editor-configurable page sections
snippets/    reusable partials (product card, cart item, swatches, etc.)
templates/   JSON templates mapping routes to sections
```

Cart, variant selection, and facets/filtering use Shopify's native Ajax Cart API and
predictive search — no third-party cart or search apps required.

## License

Built on [Dawn](https://github.com/Shopify/dawn), Shopify's reference Online Store 2.0 theme.
See [LICENSE](/LICENSE.md).
