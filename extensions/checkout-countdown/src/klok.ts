/** Rekenwerk van de aftelklok, los van de UI zodat het te testen is. */

/** Epoch-ms van het einde, of null als de instelling leeg of onleesbaar is. */
export function parseEinde(value: unknown): number | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const ms = Date.parse(value.trim());
  return Number.isFinite(ms) ? ms : null;
}

/** Resterende hele seconden, of null als de klok niet getoond moet worden. */
export function resterend(nu: number, einde: number | null, laatsteUren: unknown): number | null {
  if (einde === null) return null;
  const rest = Math.floor((einde - nu) / 1000);
  if (rest <= 0) return null;
  const uren = Number(laatsteUren);
  if (Number.isFinite(uren) && uren > 0 && rest > uren * 3600) return null;
  return rest;
}

/** [dagen, uren, minuten, seconden]. */
export function splits(rest: number): [number, number, number, number] {
  return [Math.floor(rest / 86400), Math.floor((rest % 86400) / 3600), Math.floor((rest % 3600) / 60), rest % 60];
}

const p2 = (n: number) => (n < 10 ? '0' : '') + n;

/** "1d 04:12:33" of "04:12:33", voor de schermlezertekst. */
export function formatRest(rest: number, dag: string): string {
  const [d, u, m, s] = splits(rest);
  return `${d > 0 ? `${d}${dag} ` : ''}${p2(u)}:${p2(m)}:${p2(s)}`;
}

/** Hex-kleur uit een instelling (#RGB, #RRGGBB of #RRGGBBAA); anders de standaard. */
export function kleur(value: unknown, standaard: string): string {
  const v = typeof value === 'string' ? value.trim() : '';
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v) ? v : standaard;
}

/** Hoekradius 0 tot 20; leeg of onleesbaar = de standaard. */
export function hoeken(value: unknown, standaard: number): number {
  if (value === undefined || value === null || value === '') return standaard;
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(20, Math.round(n))) : standaard;
}
