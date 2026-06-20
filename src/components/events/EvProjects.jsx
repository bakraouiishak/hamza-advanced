import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MapContainer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EV_PROJECTS } from '../../data/events.js';
import { SA_PROVINCES } from '../../data/sa-provinces.js';

/**
 * EvProjects — interactive Saudi-Arabia map + right-side panel.
 *
 * Map paint
 *  • No raster tiles. We render world country polygons via GeoJSON so all
 *    visuals are under our control — land = brand ink, KSA = sharper ink with
 *    a pink outline, surrounding countries dimmed.
 *  • Labels: we don't render any tile-baked text. Only KSA's 13 محافظات
 *    centroid labels are placed manually with L.divIcon — clean, brand-only.
 *  • Outside the polygons (the "sea") shows through to the map container's
 *    own ink background, so the whole canvas stays in identity territory.
 *
 * Interaction
 *  • Saudi-only viewport: maxBounds clamp, minZoom = country fit, maxZoom 12.
 *  • Marker click → activates that project in the right panel.
 *  • Click elsewhere on the map → clears the active project.
 *  • Pins are the brand identity vector painted pink.
 */

const SA_BOUNDS = [[16.0, 33.5], [32.5, 56.0]];
const SA_CENTER = [24.0, 45.0];

/* Brand-ink palette stops, duplicated in JS so Leaflet's `style` resolver
   (which can't read CSS variables) can paint countries + water. Three shades
   from darkest (SA land) → mid (neighbour lands) → lightest (sea & ocean). */
const INK_LAND      = '#0F1626';   // var --ev-ink   — SA land
const INK_LAND_DIM  = '#13203A';   // dimmed land    — neighbour countries
const INK_WATER     = '#1A2A48';   // lighter water  — oceans & seas
const BORDER        = 'rgba(247, 240, 245, 0.22)';
const BORDER_SA     = '#E63B5C';
const PINK          = '#E63B5C';
const CREAM         = '#F7F0F5';

/* Identity-vector pin (single SVG, currentColor) */
const PIN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 194" width="100%" height="100%">
    <path fill="currentColor"
      d="M105.344 188.481L129.908 134.476C130.833 132.442 132.462 130.812 134.494 129.889L188.476 105.368C195.699 102.086 195.699 91.807 188.476 88.5257L134.494 64.0042C132.462 63.0811 130.833 61.4516 129.908 59.4174L105.344 5.41193C102.062 -1.80397 91.8312 -1.80398 88.5492 5.41192L63.9857 59.4174C63.0605 61.4516 61.431 63.0811 59.3989 64.0042L5.41761 88.5257C-1.806 91.807 -1.806 102.086 5.41761 105.368L59.3989 129.889C61.431 130.812 63.0605 132.442 63.9857 134.476L88.5492 188.481C91.8312 195.697 102.062 195.697 105.344 188.481Z"/>
  </svg>`;

function makePinIcon(active = false) {
  const size = active ? 40 : 30;
  return L.divIcon({
    className: 'ev-map__pin',
    html: `<span class="ev-map__pin-inner ${active ? 'is-active' : ''}" style="width:${size}px;height:${size}px;">${PIN_SVG}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2 - 4],
  });
}

/* Province text label — non-interactive */
function makeProvinceLabel(arName) {
  return L.divIcon({
    className: 'ev-map__province',
    html: `<span class="ev-map__province-text">${arName}</span>`,
    iconSize: [120, 16],
    iconAnchor: [60, 8],
  });
}

function flattenMarkers(projects) {
  const out = [];
  projects.forEach((p, idx) => {
    (p.coords || []).forEach((c, k) => {
      out.push({ project: p, projectIdx: idx, coord: c, key: `${idx}-${k}` });
    });
  });
  return out;
}

/* Resize Leaflet when the parent layout settles */
function MapResize({ trigger }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 220);
    return () => clearTimeout(t);
  }, [map, trigger]);
  return null;
}

function ClickClear({ onClick }) {
  const map = useMap();
  useEffect(() => {
    const fn = () => onClick?.();
    map.on('click', fn);
    return () => map.off('click', fn);
  }, [map, onClick]);
  return null;
}

/* Style function for the world GeoJSON layer.
   • SA  → solid darkest ink, distinct pink boundary
   • Others → dimmed mid-ink, subtle cream boundary (still visible) */
function styleCountry(feature) {
  const props = feature.properties || {};
  const iso = props.ISO_A2 || props.iso_a2 || props.iso_a2_eh;
  const name = props.NAME || props.name || props.ADMIN || props.admin;
  const isSA = iso === 'SA' || name === 'Saudi Arabia';
  if (isSA) {
    return {
      fillColor: INK_LAND,
      fillOpacity: 1,
      color: BORDER_SA,
      weight: 1.4,
      opacity: 0.9,
    };
  }
  return {
    fillColor: INK_LAND_DIM,
    fillOpacity: 1,
    color: BORDER,
    weight: 0.7,
    opacity: 0.7,
  };
}

/* KSA admin boundary stroke styles — no fill, just visible cream lines */
const styleRegions = () => ({
  fill: false,
  color: 'rgba(247, 240, 245, 0.32)',
  weight: 0.9,
  opacity: 0.9,
  interactive: false,
});
const styleSubRegions = () => ({
  fill: false,
  color: 'rgba(247, 240, 245, 0.16)',
  weight: 0.5,
  opacity: 0.8,
  dashArray: '2 3',
  interactive: false,
});

/* Try a chain of URLs (CDNs / mirrors) and return the first one that parses
   as REAL GeoJSON. geoBoundaries hosts files via Git LFS, so the regular
   raw.githubusercontent endpoint returns an LFS pointer text (~140 bytes)
   instead of the geometry — we sniff for that and skip. */
async function fetchFirst(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const text = await r.text();
      // Skip Git LFS pointer files (start with "version https://git-lfs...")
      if (text.startsWith('version https://git-lfs')) continue;
      const data = JSON.parse(text);
      if (data && (data.type === 'FeatureCollection' || data.type === 'Feature')) {
        return data;
      }
    } catch {
      /* keep trying */
    }
  }
  return null;
}

/* Default active project on mount — the brief picks تدشين السوبر الإسباني والإيطالي.
   We look it up by title rather than hard-coding an index so reordering
   EV_PROJECTS later doesn't break this. */
const DEFAULT_ACTIVE_TITLE = 'تدشين السوبر الإسباني والإيطالي';
const DEFAULT_ACTIVE_IDX = (() => {
  const i = EV_PROJECTS.findIndex((p) => p.title === DEFAULT_ACTIVE_TITLE);
  return i >= 0 ? i : null;
})();

export default function EvProjects() {
  const [activeIdx, setActiveIdx] = useState(DEFAULT_ACTIVE_IDX);
  const [world, setWorld] = useState(null);
  const [saRegions, setSaRegions] = useState(null);       // KSA level 1 (13 regions)
  const [saSubRegions, setSaSubRegions] = useState(null); // KSA level 2 (governorates)
  const markers = useMemo(() => flattenMarkers(EV_PROJECTS), []);
  const activeProject = activeIdx != null ? EV_PROJECTS[activeIdx] : null;

  /* Fetch low-res world countries GeoJSON once on mount. ~120KB raw. */
  useEffect(() => {
    let alive = true;
    fetch(
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    )
      .then((r) => r.json())
      .then((data) => { if (alive) setWorld(data); })
      .catch(() => { /* offline fallback: the ink background still shows */ });
    return () => { alive = false; };
  }, []);

  /* Fetch KSA admin boundaries — regions (ADM1) + governorates (ADM2).
     We try multiple known sources for resilience; whichever responds first
     is what we draw. Both layers are stroke-only so they overlay the country
     polygons as boundary lines, scoped exclusively to inside Saudi Arabia. */
  useEffect(() => {
    let alive = true;
    fetchFirst([
      // media.githubusercontent.com auto-resolves Git LFS to the real bytes
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1_simplified.geojson',
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1.geojson',
    ]).then((d) => { if (alive && d) setSaRegions(d); });

    fetchFirst([
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM2/geoBoundaries-SAU-ADM2_simplified.geojson',
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM2/geoBoundaries-SAU-ADM2.geojson',
    ]).then((d) => { if (alive && d) setSaSubRegions(d); });

    return () => { alive = false; };
  }, []);

  return (
    <section id="projects" className="ev-section">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">سجل المشاريع المنجزة</span>
          <h2 className="ev-h2">
            من <span className="ev-hl">أعمالنا</span> على الخريطة
          </h2>
          <p className="ev-lede">
            حقّق قطاع تنظيم الفعاليات نجاحات بارزة من خلال التعاون والشراكة
            الفعّالة مع كبرى الجهات الحكومية والجامعات والشركات المرموقة في
            المملكة. حرّك الخريطة، تصفّح المؤشرات، واطّلع على تفاصيل كل مشروع.
          </p>
        </header>

        <motion.div
          className="ev-map-stage"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── RIGHT (RTL first child) — project menu / detail panel ─── */}
          <aside className="ev-map-panel" aria-live="polite">
            <AnimatePresence mode="wait">
              {activeProject ? (
                <motion.div
                  key={`detail-${activeIdx}`}
                  className="ev-map-panel__detail"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    className="ev-map-panel__back"
                    onClick={() => setActiveIdx(null)}
                    aria-label="العودة إلى قائمة المشاريع"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {activeProject.image ? (
                    <div className="ev-map-panel__cover">
                      <img
                        src={encodeURI(activeProject.image)}
                        alt={activeProject.title}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="ev-map-panel__cover ev-map-panel__cover--ph" aria-hidden="true">
                      <img src="/events/Monogram Mark.svg" alt="" />
                    </div>
                  )}

                  <span className="ev-proj__chip">{activeProject.chip}</span>
                  <h3 className="ev-map-panel__title">{activeProject.title}</h3>

                  {activeProject.meta?.length > 0 && (
                    <div className="ev-map-panel__meta">
                      {activeProject.meta.map((m) => (
                        <div key={m.lbl} className="ev-proj__meta-row">
                          <span className="ev-proj__meta-lbl">{m.lbl}:</span>
                          <span>{m.val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="ev-map-panel__body">{activeProject.body}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  className="ev-map-panel__menu"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <header className="ev-map-panel__menu-head">
                    <span className="ev-eyebrow" style={{ fontSize: '0.66rem' }}>
                      قائمة المشاريع
                    </span>
                    <h3>{EV_PROJECTS.length} مشروع منجز</h3>
                    <p>اضغط على أي مؤشر على الخريطة لمشاهدة تفاصيل المشروع.</p>
                  </header>

                  <ul className="ev-map-panel__list" role="list">
                    {EV_PROJECTS.map((p, i) => (
                      <li key={p.title}>
                        <button
                          type="button"
                          className="ev-map-panel__list-row"
                          onClick={() => setActiveIdx(i)}
                          title={p.title}
                        >
                          <span className="ev-map-panel__list-num">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="ev-map-panel__list-body">
                            <span className="ev-map-panel__list-title">{p.title}</span>
                            <span className="ev-map-panel__list-ben">{p.beneficiary}</span>
                          </span>
                          <span className="ev-map-panel__list-arrow" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* ── LEFT (RTL second child) — interactive map ───────────── */}
          <div className="ev-map">
            <MapContainer
              className="ev-map__leaflet"
              /* Fit the whole kingdom by default — `bounds` overrides
                 center/zoom so the viewport snaps to the country. */
              bounds={SA_BOUNDS}
              boundsOptions={{ padding: [16, 16] }}
              minZoom={5}
              maxZoom={11}
              maxBounds={SA_BOUNDS}
              maxBoundsViscosity={1.0}
              scrollWheelZoom
              zoomControl
              attributionControl={false}
              worldCopyJump={false}
              zoomSnap={0.25}
            >
              {/* World country polygons — paints ink + dims neighbours */}
              {world && <GeoJSON key="world" data={world} style={styleCountry} interactive={false} />}

              {/* KSA sub-regions (governorates) — subtle dashed boundaries,
                  drawn BEFORE level-1 so level-1 lines sit on top. */}
              {saSubRegions && (
                <GeoJSON
                  key="sa-sub"
                  data={saSubRegions}
                  style={styleSubRegions}
                  interactive={false}
                />
              )}

              {/* KSA regions (level 1) — stronger boundary lines */}
              {saRegions && (
                <GeoJSON
                  key="sa-regions"
                  data={saRegions}
                  style={styleRegions}
                  interactive={false}
                />
              )}

              {/* KSA province name labels — only KSA, no tile labels */}
              {SA_PROVINCES.map((p) => (
                <Marker
                  key={p.ar}
                  position={[p.lat, p.lng]}
                  icon={makeProvinceLabel(p.ar)}
                  interactive={false}
                  keyboard={false}
                />
              ))}

              {/* Project pins */}
              {markers.map(({ project, projectIdx, coord, key }) => {
                const isActive = activeIdx === projectIdx;
                return (
                  <Marker
                    key={key}
                    position={[coord.lat, coord.lng]}
                    icon={makePinIcon(isActive)}
                    eventHandlers={{
                      click: (e) => {
                        L.DomEvent.stopPropagation(e);
                        setActiveIdx(projectIdx);
                      },
                    }}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -8]}
                      opacity={1}
                      className="ev-map__tooltip"
                    >
                      {project.title}
                    </Tooltip>
                  </Marker>
                );
              })}

              <MapResize trigger={activeIdx} />
              <ClickClear onClick={() => setActiveIdx(null)} />
            </MapContainer>

            <div className="ev-map__hint" aria-hidden="true">
              <span className="ev-map__hint-dot" />
              {markers.length} موقع مُنجز
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
