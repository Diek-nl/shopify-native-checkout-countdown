# Voor AI-agents (Claude Code, Codex, Cursor)

Dit is een extension-only Shopify-app: één Checkout UI Extension, geen backend, geen database, geen access scopes. Lees eerst `README.md`, daar staat alles wat de shop-eigenaar moet weten.

## Wat je doet als iemand vraagt "installeer dit op mijn shop"

Werk de stappen uit de README af en vertel de gebruiker per stap wat er gaat gebeuren.

1. `npm install`
2. `npm run config:link`. Dit is interactief: de gebruiker logt zelf in bij Shopify, kiest een organisatie en kiest "Create this project as a new app". Jij kunt niet inloggen namens de gebruiker.
3. `npm run dev` om te testen (optioneel). Stop dit proces weer voor de volgende stap.
4. `npm run deploy` en bevestigen met ja.
5. De rest gebeurt in de browser en kun jij niet doen. Geef de gebruiker deze lijst:
   - Dev Dashboard (of Partner Dashboard) → de app → **Distributie** → **Aangepaste distributie** → **Selecteren**.
   - Winkeldomein invullen (`jouwshop.myshopify.com`) → **Link genereren** → link openen → **Installeren**.
   - Shopify-admin → **Instellingen → Checkout → Aanpassen** → **App-blok toevoegen** → "Aftelklok" → slepen → bij de blokinstellingen **Einde van de actie** invullen → **Opslaan**.
   - Op een development store: distributie overslaan, op de app-pagina direct **Install app**.

Vraag de gebruiker naar het eindmoment van de actie en geef het terug in de notatie `2026-12-01T00:00:00+01:00` (Nederlandse wintertijd `+01:00`, zomertijd `+02:00`; 23:59 op dag X = 00:00 op dag X+1).

Vereisten vóór je begint: Node 20 of nieuwer (`node -v`); voor `npm test` Node 22.6 of nieuwer.

## Regels

- `shopify.app.toml` is een template. `config:link` maakt `shopify.app.<naam>.toml` aan met de `client_id`; dat bestand staat in `.gitignore`. Commit het nooit, en zet nooit een `client_id` in `shopify.app.toml`.
- Voeg geen access scopes, backend, webhooks of externe netwerkcalls toe.
- Verander `uid` en `handle` in `extensions/checkout-countdown/shopify.extension.toml` niet na een eerste deploy; anders ziet Shopify het als een nieuwe extensie en verdwijnt het blok uit de checkout-editor.
- `npm run typecheck` en `npm test` moeten slagen voordat je deployt.
- Bouw geen klok die per bezoeker opnieuw begint of terugspringt. Dit blok telt af naar één echt eindmoment.
- Waarden uit de instellingen die in de SVG komen, gaan altijd door `kleur()`, `hoeken()` of `esc()`.

## Structuur

```
shopify.app.toml                      app-config (template)
extensions/checkout-countdown/
  shopify.extension.toml              targets + instellingen
  src/klok.ts                         rekenwerk: einde, resterende tijd, kleuren
  src/banner.ts                       de SVG
  src/Countdown.tsx                   het blok
  locales/                            en (standaard), nl, de, fr
  test/klok.test.ts                   node --test
```

Gebouwd door Diek Thunnissen, DIEK (https://diek.nl). Vragen of maatwerk: info@diek.nl.
