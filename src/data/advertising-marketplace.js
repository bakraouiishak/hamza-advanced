/**
 * Hamza Advanced — Advertising Marketplace dataset (frontend skeleton).
 *
 * IMPORTANT — the actual catalog (categories, products, packs, banners) will
 * be served by the backend that has not been built yet. This file ships only
 * the SHAPES so layout components can render with the correct number of
 * skeleton tiles. Every field that would normally come from the API is left
 * either `null` or `''` so it renders as a blank placeholder.
 *
 * When the backend lands, replace `_skeleton`/`null` with real data and the
 * UI will paint without further changes.
 */

/* ── Brand info — re-used inside the marketplace nav + footer ─────────── */
export const MARKET_BRAND = {
  name: 'متجر الهمزة المتطورة',
  parent: 'الهمزة المتطورة — للدعاية والإعلان',
  tagline: 'كل ما تحتاجه لحضور بصري لا يُنسى — في مكان واحد.',
};

/* ── Hero / homepage banners (1 slot for now) ─────────────────────────── */
export const MARKET_BANNERS = [
  { id: 'b1', title: null, subtitle: null, ctaLabel: null, href: null, image: null },
];

/* ── Category tiles — fixed grid on the home page.
   The labels are the only data leaking client-side; everything visual (icon,
   color, count) will be hydrated by the backend. ─────────────────────── */
/**
 * Marketplace category tiles — canonical order shared with the backend
 * (see backend/models/Product.js → PRODUCT_CATEGORIES). The labels here are
 * the brand-approved full names; never abbreviate or reorder without
 * updating the backend enum first.
 */
export const MARKET_CATEGORIES = [
  { id: 'c-events',     label: 'إدارة الفعاليات والمؤتمرات والمعارض',   count: null, image: null },
  { id: 'c-print',      label: 'المطبوعات الورقية',                       count: null, image: null },
  { id: 'c-packaging',  label: 'علب المنتجات والتغليف',                   count: null, image: null },
  { id: 'c-bags',       label: 'الأكياس الورقية والبلاستيكية',            count: null, image: null },
  { id: 'c-signage',    label: 'الحروف البارزة',                          count: null, image: null },
  { id: 'c-gifts',      label: 'الهدايا الدعائية والدروع',                count: null, image: null },
  { id: 'c-acrylic',    label: 'أعمال الاكريليك والفوركس والخشب',        count: null, image: null },
  { id: 'c-stickers',   label: 'الاستكرات والبنرات واللوحات الدعائية',   count: null, image: null },
  { id: 'c-uv',         label: 'الطباعة المباشرة على المواد UV',          count: null, image: null },
  { id: 'c-identity',   label: 'التصاميم والهويات البصرية',               count: null, image: null },
  { id: 'c-stands',     label: 'الاستاندات وطاولات العرض والأعلام',       count: null, image: null },
  { id: 'c-uniform',    label: 'الزي الموحد',                             count: null, image: null },
];

/* ── Featured products carousel — 10 empty card slots for now ─────────── */
export const MARKET_PRODUCTS = Array.from({ length: 10 }, (_, i) => ({
  id: `p-skeleton-${i + 1}`,
  title: null,         // backend
  short: null,         // backend
  price: null,         // backend (number)
  oldPrice: null,      // backend (optional)
  category: null,      // backend (label)
  image: null,         // backend (url)
  badge: null,         // backend ('جديد' | 'الأكثر طلباً' | etc.)
}));

/* ── Discounted packs (3 fixed card slots) ───────────────────────────── */
export const MARKET_PACKS = [
  { id: 'pk-skeleton-1', title: null, items: null, oldPrice: null, price: null, discountPct: null, image: null, accent: 'starter' },
  { id: 'pk-skeleton-2', title: null, items: null, oldPrice: null, price: null, discountPct: null, image: null, accent: 'pro' },
  { id: 'pk-skeleton-3', title: null, items: null, oldPrice: null, price: null, discountPct: null, image: null, accent: 'enterprise' },
];

/* ── Trust/promise strip (icons + labels, no images needed) ───────────── */
export const MARKET_TRUST = [
  { id: 't-ship',   label: 'شحن سريع',           sub: 'لكل مناطق المملكة' },
  { id: 't-pay',    label: 'دفع آمن',             sub: 'مدى، فيزا، Apple Pay' },
  { id: 't-quality', label: 'جودة مضمونة',         sub: 'ضمان استبدال 7 أيام' },
  { id: 't-support', label: 'دعم على مدار الساعة', sub: 'فريق متخصص جاهز' },
];
