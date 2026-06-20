import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MapContainer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PROJECTS,
  PROJECT_CITIES,
  PROJECT_SECTORS,
  PROJECTS_BY_CITY,
} from '../data/projects.js';
import { SA_PROVINCES } from '../data/sa-provinces.js';

/**
 * Projects — Hamza Advanced enterprise-wide interactive Saudi-Arabia map.
 *
 * Map rendering, GeoJSON sourcing, KSA admin boundary overlay, click-to-clear
 * and resize behaviour are cloned from EvProjects (Events sector). UI chrome
 * (overlaid locations menu, count-diamond pins, custom zoom controls, bottom
 * title block) follows the Vision2030 projects-map pattern, tailored to the
 * main brand — emerald accents + VIP Hakm typography.
 *
 * Layout
 *  • 100% screen width section.
 *  • Map fills the whole stage.
 *  • Locations menu floats absolutely on the start side (overlay).
 *  • Bottom-end: title block + custom +/− zoom controls.
 *  • Mobile: menu hidden, sizes scaled down.
 */

const SA_BOUNDS = [[16.0, 33.5], [32.5, 56.0]];

const INK_LAND      = '#0A1020';
const INK_LAND_DIM  = '#0F1A2E';
const BORDER        = 'rgba(247, 240, 245, 0.18)';
const BORDER_SA     = '#13BD84';

/* Style function for the world GeoJSON layer.
   • SA  → solid darkest ink, emerald boundary
   • Others → dimmed mid-ink, subtle cream boundary */
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
      opacity: 0.85,
    };
  }
  return {
    fillColor: INK_LAND_DIM,
    fillOpacity: 1,
    color: BORDER,
    weight: 0.6,
    opacity: 0.6,
  };
}

const styleRegions = () => ({
  fill: false,
  color: 'rgba(247, 240, 245, 0.28)',
  weight: 0.8,
  opacity: 0.85,
  interactive: false,
});
const styleSubRegions = () => ({
  fill: false,
  color: 'rgba(247, 240, 245, 0.14)',
  weight: 0.5,
  opacity: 0.75,
  dashArray: '2 3',
  interactive: false,
});

/* Try a chain of URLs and return first that parses as REAL GeoJSON
   (skipping Git-LFS pointer text). */
async function fetchFirst(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const text = await r.text();
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

/* Count-diamond pin (Vision2030 style) */
function makeCountPin(count, active = false) {
  const size = active ? 52 : 44;
  return L.divIcon({
    className: 'proj-pin',
    html: `
      <div class="proj-pin__wrap ${active ? 'is-active' : ''}" style="width:${size}px;height:${size}px;">
        <div class="proj-pin__diamond"></div>
        <span class="proj-pin__count">${count}</span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2 - 4],
  });
}

/* Province text label — non-interactive */
function makeProvinceLabel(arName) {
  return L.divIcon({
    className: 'proj-map__province',
    html: `<span class="proj-map__province-text">${arName}</span>`,
    iconSize: [120, 16],
    iconAnchor: [60, 8],
  });
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

/* Imperative pan/zoom to a [lat,lng] when the active city changes */
function FlyTo({ target, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, zoom || 7, { duration: 0.9 });
  }, [target, zoom, map]);
  return null;
}

/* ─── Point-in-polygon (ray casting) for [lng, lat] tuples ─── */
function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect =
      ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInFeature(lat, lng, feature) {
  if (!feature) return false;
  const geom = feature.geometry;
  if (!geom) return false;
  const polys =
    geom.type === 'Polygon'
      ? [geom.coordinates]
      : geom.type === 'MultiPolygon'
        ? geom.coordinates
        : [];
  for (const poly of polys) {
    const [outer, ...holes] = poly;
    if (!pointInRing(lng, lat, outer)) continue;
    let inHole = false;
    for (const h of holes) {
      if (pointInRing(lng, lat, h)) { inHole = true; break; }
    }
    if (!inHole) return true;
  }
  return false;
}

/* Scroll-wheel zoom is gated to the Saudi Arabia polygon. When the cursor
   leaves the country (over neighbour land or the sea), the wheel falls
   through to normal page scroll — much friendlier on a long page. */
function SAOnlyScrollZoom({ world }) {
  const map = useMap();
  useEffect(() => {
    if (!world) return;
    const saFeature = world.features.find((f) => {
      const props = f.properties || {};
      const iso = props.ISO_A2 || props.iso_a2 || props.iso_a2_eh;
      const name = props.NAME || props.name || props.ADMIN || props.admin;
      return iso === 'SA' || name === 'Saudi Arabia';
    });
    if (!saFeature) return;

    // Start disabled so the page scrolls until the cursor enters KSA
    map.scrollWheelZoom.disable();

    const onMove = (e) => {
      const { lat, lng } = e.latlng;
      const inside = pointInFeature(lat, lng, saFeature);
      if (inside) {
        if (!map.scrollWheelZoom.enabled()) map.scrollWheelZoom.enable();
      } else if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      }
    };
    const onLeave = () => map.scrollWheelZoom.disable();

    map.on('mousemove', onMove);
    map.on('mouseout', onLeave);
    return () => {
      map.off('mousemove', onMove);
      map.off('mouseout', onLeave);
    };
  }, [map, world]);
  return null;
}

/* Custom +/− zoom buttons — replaces Leaflet's default control */
function ZoomControls() {
  const map = useMap();
  return (
    <div className="proj-zoom" aria-label="مفاتيح التكبير والتصغير">
      <button
        type="button"
        className="proj-zoom__btn"
        onClick={() => map.zoomIn()}
        aria-label="تكبير"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <button
        type="button"
        className="proj-zoom__btn"
        onClick={() => map.zoomOut()}
        aria-label="تصغير"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

const FILTERS = [
  { id: 'all',      label: 'الكل' },
  { id: 'events',   label: 'الفعاليات' },
  { id: 'electric', label: 'الكهرباء' },
  { id: 'ads',      label: 'الإعلانات' },
  { id: 'travel',   label: 'السياحة' },
];

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(null);     // selected project index in PROJECTS
  const [activeCity, setActiveCity] = useState(null);   // city id selected via pin click
  const [filterId, setFilterId] = useState('all');
  const [flyTarget, setFlyTarget] = useState(null);
  const [world, setWorld] = useState(null);
  const [saRegions, setSaRegions] = useState(null);
  const [saSubRegions, setSaSubRegions] = useState(null);

  const activeProject = activeIdx != null ? PROJECTS[activeIdx] : null;
  const cityCardsOpen = !!activeCity;

  const filteredProjects = useMemo(() => {
    if (filterId === 'all') return PROJECTS.map((p, i) => ({ p, i }));
    return PROJECTS
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.sector === filterId);
  }, [filterId]);

  /* Projects visible in the bottom horizontal scroller — only items in the
     currently selected city (active when a pin was clicked). */
  const cityProjects = useMemo(() => {
    if (!activeCity) return [];
    return PROJECTS
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.city === activeCity);
  }, [activeCity]);

  const activeCityMeta = activeCity
    ? PROJECT_CITIES.find((c) => c.id === activeCity)
    : null;

  /* Count pins per city, filtered */
  const cityCounts = useMemo(() => {
    const items = filterId === 'all' ? PROJECTS : PROJECTS.filter((p) => p.sector === filterId);
    return PROJECT_CITIES.map((c) => ({
      ...c,
      count: items.filter((p) => p.city === c.id).length,
    })).filter((c) => c.count > 0);
  }, [filterId]);

  /* Fetch world countries GeoJSON once on mount */
  useEffect(() => {
    let alive = true;
    fetch(
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    )
      .then((r) => r.json())
      .then((data) => { if (alive) setWorld(data); })
      .catch(() => { /* offline fallback */ });
    return () => { alive = false; };
  }, []);

  /* KSA admin boundaries (regions + governorates) */
  useEffect(() => {
    let alive = true;
    fetchFirst([
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1_simplified.geojson',
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1.geojson',
    ]).then((d) => { if (alive && d) setSaRegions(d); });

    fetchFirst([
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM2/geoBoundaries-SAU-ADM2_simplified.geojson',
      'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SAU/ADM2/geoBoundaries-SAU-ADM2.geojson',
    ]).then((d) => { if (alive && d) setSaSubRegions(d); });

    return () => { alive = false; };
  }, []);

  const onSelectProject = (idx) => {
    setActiveIdx(idx);
    const p = PROJECTS[idx];
    if (p?.coords?.[0]) {
      setFlyTarget([p.coords[0].lat, p.coords[0].lng]);
    }
  };

  const onPickCity = (cityId) => {
    const city = PROJECT_CITIES.find((c) => c.id === cityId);
    if (!city) return;
    setFlyTarget([city.lat, city.lng]);
    setActiveCity(cityId);
    setActiveIdx(null); // re-opening a city restarts the flow
  };

  /* Map clicks anywhere outside markers clear both city-cards mode AND the
     active project detail — i.e. revert the info container to default. */
  const onMapEmptyClick = () => {
    setActiveIdx(null);
    setActiveCity(null);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-stage">
        {/* ── Map (full background) ─────────────────────────────────── */}
        <MapContainer
          className="projects-map"
          bounds={SA_BOUNDS}
          boundsOptions={{ padding: [40, 40] }}
          minZoom={5}
          maxZoom={11}
          maxBounds={SA_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          worldCopyJump={false}
          zoomSnap={0.25}
        >
          {world && <GeoJSON key="world" data={world} style={styleCountry} interactive={false} />}

          {saSubRegions && (
            <GeoJSON key="sa-sub" data={saSubRegions} style={styleSubRegions} interactive={false} />
          )}

          {saRegions && (
            <GeoJSON key="sa-regions" data={saRegions} style={styleRegions} interactive={false} />
          )}

          {SA_PROVINCES.map((p) => (
            <Marker
              key={p.ar}
              position={[p.lat, p.lng]}
              icon={makeProvinceLabel(p.ar)}
              interactive={false}
              keyboard={false}
            />
          ))}

          {/* City count-pins */}
          {cityCounts.map((c) => {
            const isActive = activeProject?.city === c.id;
            return (
              <Marker
                key={c.id}
                position={[c.lat, c.lng]}
                icon={makeCountPin(c.count, isActive)}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    onPickCity(c.id);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1} className="proj-map__tooltip">
                  {c.ar} — {c.count} مشاريع
                </Tooltip>
              </Marker>
            );
          })}

          <MapResize trigger={`${activeIdx}-${activeCity}-${filterId}`} />
          <ClickClear onClick={onMapEmptyClick} />
          <FlyTo target={flyTarget} zoom={activeProject ? 8.5 : 6.5} />
          <SAOnlyScrollZoom world={world} />
          {/* Zoom controls hide while a city's card list is open */}
          {!cityCardsOpen && <ZoomControls />}
        </MapContainer>

        {/* ── Soft inner shadow / vignette over the map ─────────────── */}
        <div className="projects-vignette" aria-hidden="true" />

        {/* ── Locations menu (absolute overlay) ─────────────────────── */}
        <aside className="projects-menu" aria-live="polite">
          <AnimatePresence mode="wait">
            {activeProject ? (
              <motion.div
                key={`detail-${activeIdx}`}
                className="projects-menu__detail"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="projects-menu__back"
                  onClick={() => setActiveIdx(null)}
                  aria-label="العودة إلى قائمة المشاريع"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span>عودة</span>
                </button>

                <div className="projects-menu__cover">
                  {activeProject.image && (
                    <img
                      className="projects-menu__cover-img"
                      src={encodeURI(activeProject.image)}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <span
                    className="projects-menu__cover-overlay"
                    style={{
                      background: `linear-gradient(135deg, ${PROJECT_SECTORS[activeProject.sector].color}55 0%, rgba(11,18,32,0.9) 100%)`,
                    }}
                  />
                  <span
                    className="projects-menu__cover-chip"
                    style={{ background: PROJECT_SECTORS[activeProject.sector].color, color: '#0B1220' }}
                  >
                    {PROJECT_SECTORS[activeProject.sector].ar}
                  </span>
                </div>

                <h3 className="projects-menu__detail-title">{activeProject.title}</h3>

                {activeProject.meta?.length > 0 && (
                  <div className="projects-menu__meta">
                    {activeProject.meta.map((m) => (
                      <div key={m.lbl} className="projects-menu__meta-row">
                        <span className="projects-menu__meta-lbl">{m.lbl}:</span>
                        <span>{m.val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="projects-menu__detail-body">{activeProject.body}</p>
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                className="projects-menu__list-wrap"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="projects-menu__tabs" role="tablist">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      aria-selected={filterId === f.id}
                      className={`projects-menu__tab ${filterId === f.id ? 'is-active' : ''}`}
                      onClick={() => setFilterId(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <ul className="projects-menu__list" role="list">
                  {filteredProjects.map(({ p, i }) => {
                    const sector = PROJECT_SECTORS[p.sector];
                    return (
                      <li key={`${p.title}-${i}`}>
                        <button
                          type="button"
                          className="projects-menu__row"
                          onClick={() => onSelectProject(i)}
                          title={p.title}
                        >
                          <span className="projects-menu__row-thumb">
                            {p.image && (
                              <img
                                className="projects-menu__row-thumb-img"
                                src={encodeURI(p.image)}
                                alt=""
                                loading="lazy"
                              />
                            )}
                            <span
                              className="projects-menu__row-thumb-overlay"
                              style={{
                                background: `linear-gradient(135deg, ${sector.color}55 0%, rgba(11,18,32,0.9) 100%)`,
                              }}
                            />
                            <span
                              className="projects-menu__row-dot"
                              style={{ background: sector.color }}
                            />
                          </span>
                          <span className="projects-menu__row-body">
                            <span className="projects-menu__row-title">{p.title}</span>
                            <span className="projects-menu__row-meta">
                              {sector.ar} · {PROJECT_CITIES.find((c) => c.id === p.city)?.ar}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* ── Bottom-end panel — title block by default, horizontal card
              scroller when a city pin is active, full event detail when an
              event card is then clicked ─────────────────────────────── */}
        <div className={`projects-info ${cityCardsOpen ? 'is-cards' : ''} ${activeProject && cityCardsOpen ? 'is-detail' : ''}`}>
          <AnimatePresence mode="wait">
            {cityCardsOpen && activeProject ? (
              <motion.div
                key={`info-detail-${activeIdx}`}
                className="projects-info__detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="projects-info__back"
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(null); }}
                  aria-label="العودة إلى قائمة مشاريع المنطقة"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span>عودة</span>
                </button>
                <div className="projects-info__detail-grid">
                  <div className="projects-info__detail-cover">
                    {activeProject.image && (
                      <img
                        className="projects-info__detail-img"
                        src={encodeURI(activeProject.image)}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span
                      className="projects-info__detail-overlay"
                      style={{
                        background: `linear-gradient(135deg, ${PROJECT_SECTORS[activeProject.sector].color}55 0%, rgba(11,18,32,0.92) 100%)`,
                      }}
                    />
                    <span
                      className="projects-info__detail-chip"
                      style={{ background: PROJECT_SECTORS[activeProject.sector].color, color: '#0B1220' }}
                    >
                      {PROJECT_SECTORS[activeProject.sector].ar}
                    </span>
                  </div>
                  <div className="projects-info__detail-body-wrap">
                    <h3 className="projects-info__detail-title">{activeProject.title}</h3>
                    {activeProject.meta?.length > 0 && (
                      <div className="projects-info__detail-meta">
                        {activeProject.meta.slice(0, 2).map((m) => (
                          <div key={m.lbl} className="projects-info__detail-meta-row">
                            <span className="projects-info__detail-meta-lbl">{m.lbl}:</span>
                            <span>{m.val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="projects-info__detail-body">{activeProject.body}</p>
                  </div>
                </div>
              </motion.div>
            ) : cityCardsOpen ? (
              <motion.div
                key="cards"
                className="projects-info__cards-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="projects-info__cards-head">
                  <span className="projects-info__eyebrow">
                    {activeCityMeta?.ar} · {cityProjects.length} مشروع
                  </span>
                </div>
                <div
                  className="projects-info__cards"
                  role="list"
                  onClick={(e) => e.stopPropagation()}
                >
                  {cityProjects.map(({ p, i }) => {
                    const sector = PROJECT_SECTORS[p.sector];
                    return (
                      <button
                        key={i}
                        type="button"
                        className="projects-info__card"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(i);
                        }}
                      >
                        <span className="projects-info__card-media">
                          {p.image && (
                            <img
                              className="projects-info__card-img"
                              src={encodeURI(p.image)}
                              alt=""
                              loading="lazy"
                            />
                          )}
                          <span
                            className="projects-info__card-overlay"
                            style={{
                              background: `linear-gradient(135deg, ${sector.color}55 0%, rgba(11,18,32,0.92) 100%)`,
                            }}
                          />
                          <span
                            className="projects-info__card-chip"
                            style={{ background: sector.color, color: '#0B1220' }}
                          >
                            {sector.ar}
                          </span>
                        </span>
                        <span className="projects-info__card-title">{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                className="projects-info__default"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="projects-info__eyebrow">سجل المشاريع</span>
                <h2 className="projects-info__title">
                  تتبّع خريطة <span className="projects-info__hl">المشاريع</span>
                </h2>
                <p className="projects-info__desc">
                  تنقّل بين مناطق ومشاريع المؤسسة عبر أربعة قطاعات في المملكة باستخدام مفاتيح التكبير والتصغير.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
