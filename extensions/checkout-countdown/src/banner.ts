/**
 * De aftelklok als SVG (data-URI): gekleurd vlak, kop + regel links, vakjes met cijfers rechts.
 *
 * Waarom een afbeelding? Checkout-componenten (Polaris `s-*`) kennen geen eigen kleuren en geen
 * grote vette cijfers; met alleen tekst wordt een klok een grijs regeltje. Een SVG in `s-image`
 * mag wel elke kleur hebben. De tekst voor schermlezers staat in het `alt`-attribuut.
 *
 * Eigen lettertype? Een SVG-afbeelding mag geen externe lettertypes laden. Zet je lettertype
 * (liefst teruggebracht tot hoofdletters en cijfers) als base64-woff2 in een @font-face binnen
 * <defs><style>…</style></defs> en verwijs ernaar met font-family. Let op de licentie.
 */
import { splits } from './klok.ts';

export const BANNER_W = 400;
export const BANNER_H = 76;
export const BANNER_ASPECT_RATIO = `${BANNER_W}/${BANNER_H}`;

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const VAK_W = 42;
const VAK_H = 48;
const VAK_GAP = 6;
const RAND = 16;

export interface BannerOpties {
  kop: string;
  regel: string;
  /** Labels onder de vakjes: dagen, uren, minuten, seconden. */
  labels: [string, string, string, string];
  vlak: string;
  tekst: string;
  vakjes: string;
  cijfers: string;
  hoeken: number;
}

const p2 = (n: number) => (n < 10 ? '0' : '') + n;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function bannerSvg(rest: number, o: BannerOpties): string {
  // Zonder hele dag (de laatste dag) vervalt het dag-vakje: drie vakjes.
  const alle = splits(rest);
  const van = alle[0] > 0 ? 0 : 1;
  const delen = alle.slice(van);
  const breedte = delen.length * VAK_W + (delen.length - 1) * VAK_GAP;
  const x0 = BANNER_W - RAND - breedte;
  const y0 = (BANNER_H - VAK_H) / 2;
  const vakjes = delen
    .map((n, i) => {
      const x = x0 + i * (VAK_W + VAK_GAP);
      const mid = x + VAK_W / 2;
      return (
        `<rect x="${x}" y="${y0}" width="${VAK_W}" height="${VAK_H}" rx="${Math.min(4, o.hoeken)}" fill="${o.vakjes}"/>` +
        `<text x="${mid}" y="${y0 + 27}" text-anchor="middle" font-size="23" font-weight="800" fill="${o.cijfers}">${p2(n)}</text>` +
        `<text x="${mid}" y="${y0 + 41}" text-anchor="middle" font-size="8" font-weight="700" letter-spacing="0.6" fill="${o.cijfers}" fill-opacity="0.6">${esc(o.labels[i + van].toUpperCase())}</text>`
      );
    })
    .join('');
  // Lange teksten worden in de ruimte links van de vakjes geperst in plaats van eronder te lopen.
  const ruimte = x0 - RAND - 10;
  const pers = (tekst: string, tekens: number) => (tekst.length > tekens ? ` textLength="${ruimte}" lengthAdjust="spacingAndGlyphs"` : '');
  const maxKop = Math.floor(ruimte / 10.2);
  const maxRegel = Math.floor(ruimte / 6.6);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BANNER_W}" height="${BANNER_H}" viewBox="0 0 ${BANNER_W} ${BANNER_H}" font-family="${FONT}" style="font-variant-numeric:tabular-nums">` +
    `<rect width="${BANNER_W}" height="${BANNER_H}" rx="${o.hoeken}" fill="${o.vlak}"/>` +
    `<text x="${RAND}" y="35" font-size="15" font-weight="800" letter-spacing="0.4" fill="${o.tekst}"${pers(o.kop, maxKop)}>${esc(o.kop.toUpperCase())}</text>` +
    `<text x="${RAND}" y="53" font-size="12" font-weight="600" fill="${o.tekst}" fill-opacity="0.9"${pers(o.regel, maxRegel)}>${esc(o.regel)}</text>` +
    vakjes +
    `</svg>`
  );
}

export function bannerDataUri(rest: number, o: BannerOpties): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(bannerSvg(rest, o))}`;
}
