import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { BANNER_ASPECT_RATIO, bannerDataUri } from './banner.ts';
import { formatRest, hoeken, kleur, parseEinde, resterend } from './klok.ts';

/**
 * Aftelklok voor de checkout en de bedankpagina.
 * Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT
 *
 * Telt af naar de blokinstelling `einde`. Zonder (leesbaar) einde, na het einde of buiten het
 * venster van "alleen de laatste … uur" toont het blok niets. In de checkout-editor staat er
 * dan een korte aanwijzing, zodat je het blok terugvindt. De klok loopt op de tijd van het
 * apparaat van de koper; het eindmoment zelf is voor iedereen hetzelfde (tijdzone in de datum).
 */

export default function () {
  render(<Countdown />, document.body);
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function Countdown() {
  // `shopify.settings` is een signal: een wijziging in de editor tekent het blok opnieuw.
  const settings = shopify.settings.value;
  const einde = parseEinde(settings.einde);
  const [nu, setNu] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNu(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = shopify.i18n.translate;
  const rest = resterend(nu, einde, settings.laatste_uren);

  if (rest === null) {
    // Alleen in de editor: zeg waarom er niets staat. Klanten zien dit nooit.
    if (!shopify.extension.editor) return null;
    return <s-text color="subdued">{einde === null ? t('editorGeenEinde') : t('editorVerborgen')}</s-text>;
  }

  const kop = clean(settings.kop) || t('kop');
  const regel = clean(settings.regel) || t('eindigt');
  const src = bannerDataUri(rest, {
    kop,
    regel,
    labels: [t('dagen'), t('uren'), t('minuten'), t('seconden')],
    vlak: kleur(settings.kleur_vlak, '#121212'),
    tekst: kleur(settings.kleur_tekst, '#FFFFFF'),
    vakjes: kleur(settings.kleur_vakjes, '#FFFFFF'),
    cijfers: kleur(settings.kleur_cijfers, '#121212'),
    hoeken: hoeken(settings.hoeken, 8),
  });

  // Eén afbeelding over de volle breedte; de tekst voor schermlezers staat in `alt`.
  return (
    <s-image
      src={src}
      alt={`${kop} ${regel} ${formatRest(rest, t('dag'))}`}
      aspectRatio={BANNER_ASPECT_RATIO}
      inlineSize="fill"
      objectFit="contain"
    ></s-image>
  );
}
