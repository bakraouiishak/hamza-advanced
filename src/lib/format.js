/**
 * Tiny formatting helpers — Arabic-locale + currency.
 */

/* `ar-SA-u-nu-latn` = Arabic-Saudi locale with the Latin numbering system.
   Keeps Arabic word forms ("مايو") but renders digits as 0-9, not ٠-٩. */
const AR_LATN = 'ar-SA-u-nu-latn';
const NF = new Intl.NumberFormat(AR_LATN);
const NF_PRICE = new Intl.NumberFormat(AR_LATN, { maximumFractionDigits: 2 });

export const fmtInt = (n) => (n == null ? '—' : NF.format(Math.round(Number(n) || 0)));

/**
 * fmtNum — formatted number without any currency symbol. Use this with
 * the <Price> component which renders the Saudi Riyal SVG icon itself.
 */
export const fmtNum = (n) => {
  if (n == null) return '—';
  return NF_PRICE.format(Number(n) || 0);
};

/**
 * fmtMoney — plain-text formatter for contexts where JSX is impossible
 * (Recharts tooltips, <option> elements, etc.). Uses the Unicode Riyal
 * sign (﷼) as a fallback representation. Prefer <Price> in all other
 * places for the official SAMA SVG icon.
 */
export const fmtMoney = (n) => {
  if (n == null) return '—';
  return `﷼ ${NF_PRICE.format(Number(n) || 0)}`;
};

export const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return new Intl.DateTimeFormat(AR_LATN, {
    year: 'numeric', month: 'short', day: '2-digit',
  }).format(date);
};

export const fmtDateTime = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return new Intl.DateTimeFormat(AR_LATN, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(date);
};

export const fmtRelative = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  const diffMs = Date.now() - date.getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1)   return 'الآن';
  if (min < 60)  return `قبل ${min} د`;
  const hr = Math.round(min / 60);
  if (hr < 24)   return `قبل ${hr} س`;
  const days = Math.round(hr / 24);
  if (days < 30) return `قبل ${days} ي`;
  return fmtDate(d);
};
