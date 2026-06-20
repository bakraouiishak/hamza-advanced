import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import '../styles/visit-marketplace.css';

const FALLBACK_PRODUCTS = [
  {
    _id: "p-fb-1",
    name: "درع أكريليك كريستالي فاخر",
    category: "الهدايا الدعائية والدروع",
    price: 180,
    width: 20,
    height: 30,
    length: 5,
    onDemand: false,
    mainImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80",
    reference: "AWR-001"
  },
  {
    _id: "p-fb-2",
    name: "علبة هدايا كرتونية مقواة فاخرة",
    category: "علب المنتجات والتغليف",
    price: 12,
    width: 15,
    height: 15,
    length: 10,
    onDemand: false,
    mainImage: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
    reference: "BOX-002"
  },
  {
    _id: "p-fb-3",
    name: "أكياس ورقية كرافت بمقابض حبل",
    category: "الأكياس الورقية والبلاستيكية",
    price: 3.5,
    width: 25,
    height: 35,
    length: 8,
    onDemand: false,
    mainImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    reference: "BAG-001"
  },
  {
    _id: "p-fb-4",
    name: "بوث عرض معارض متكامل",
    category: "إدارة الفعاليات والمؤتمرات والمعارض",
    onDemand: true,
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    reference: "EVT-001"
  },
  {
    _id: "p-fb-5",
    name: "لوحة إعلانية خارجية مضيئة",
    category: "الاستكرات والبنرات واللوحات الدعائية",
    price: 2400,
    width: 200,
    height: 100,
    onDemand: false,
    mainImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    reference: "STR-002"
  },
  {
    _id: "p-fb-6",
    name: "بطاقات عمل فاخرة ببصمة ذهبية",
    category: "المطبوعات الورقية",
    price: 150,
    width: 9,
    height: 5,
    onDemand: false,
    mainImage: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=600&q=80",
    animationMedia: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=600&q=80",
    reference: "PAP-002"
  }
];

export default function VisitMarketplace() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [isHovered, setIsHovered] = useState(false);
  
  const speedRef = useRef(0.8);
  const currentSpeedRef = useRef(0.8);
  const positionRef = useRef(-1296);
  const trackRef = useRef(null);

  // Attempt to fetch real products from API, fallback to high-quality Unsplash mock catalog on failure
  useEffect(() => {
    let alive = true;
    api.get('/products?limit=30')
      .then(res => {
        if (alive && res && res.items && res.items.length >= 6) {
          const valid = res.items.filter(p => p.mainImage);
          if (valid.length >= 6) {
            const shuffled = [...valid].sort(() => 0.5 - Math.random()).slice(0, 6);
            setProducts(shuffled);
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to high-res static images
      });
    return () => { alive = false; };
  }, []);

  // Autoplay translation loop using requestAnimationFrame + Lerp for gentle ease-in/ease-out pause and deceleration near center
  useEffect(() => {
    let frameId;
    const cardWidth = 216; // 200px width + 16px gap
    const loopWidth = cardWidth * 6; // 1296px

    const update = () => {
      // 1. Calculate dynamic slowdown factor based on proximity of any card to the center (250px)
      let minDist = 99999;
      for (let i = 0; i < products.length * 2; i++) {
        // Center position of card i relative to carousel viewport
        const cardCenter = positionRef.current + i * cardWidth + 16 + 100; // 16px padding, 100px half card width
        const dist = Math.abs(cardCenter - 250);
        if (dist < minDist) {
          minDist = dist;
        }
      }

      // Proximity factor: 1 when exactly at center, 0 when midway (108px away)
      const slowdownF = Math.max(0, 1 - minDist / 108);
      
      // Calculate target cruising speed: slow down to 0.15px/frame at center, otherwise 0.8px/frame
      const baseSpeed = 0.8;
      const minSpeed = 0.15;
      const targetCruisingSpeed = baseSpeed - slowdownF * (baseSpeed - minSpeed);
      
      // Set active target speed (pause on hover overrides)
      speedRef.current = isHovered ? 0 : targetCruisingSpeed;

      // 2. Smooth deceleration/acceleration using linear interpolation (lerp)
      currentSpeedRef.current += (speedRef.current - currentSpeedRef.current) * 0.08;
      
      // Translate positive (left to right)
      positionRef.current += currentSpeedRef.current;
      
      // Wrapping math for infinite seamless scrolling
      if (positionRef.current >= 0) {
        positionRef.current -= loopWidth;
      }
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
        
        // 3. Apply individual scale, opacity, and z-index to cards based on distance to center
        const cards = trackRef.current.children;
        if (cards && cards.length > 0) {
          for (let i = 0; i < cards.length; i++) {
            const cardCenter = positionRef.current + i * cardWidth + 16 + 100;
            const dist = Math.abs(cardCenter - 250);
            
            // Active proximity factor (wider radius of 180px for scale/fade transition)
            const f = Math.max(0, 1 - dist / 180);
            const smoothF = f * f * (3 - 2 * f); // Smooth ease-in-out curve
            
            const scale = 1 + smoothF * 0.12; // Scale up to 1.12x in the center
            const opacity = 0.35 + smoothF * 0.65; // Fade down other cards to 0.35
            
            cards[i].style.transform = `scale(${scale})`;
            cards[i].style.opacity = opacity;
            cards[i].style.zIndex = Math.round(opacity * 10);
          }
        }
      }
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [products, isHovered]);

  return (
    <section className="marketplace" dir="rtl">
      {/* Background Pattern */}
      <div className="marketplace__pattern" />
      
      {/* Background Gradient Overlay */}
      <div className="marketplace__overlay" />
      
      <div className="marketplace__inner">
        {/* ── Right Side Content ── */}
        <div className="marketplace__content">
          <div className="marketplace__badge">
            جديد موقعنا
          </div>
          
          <h2 className="marketplace__title">
            <span className="marketplace__title-white">اكتشف</span>
            <span className="marketplace__title-yellow">متــجــرنـــا</span>
            <span className="marketplace__title-yellow">الالكتروني</span>
          </h2>
          
          <p className="marketplace__desc">
            تفاصيل كتابة شرح المتجر الالكتروني وموقع القطاع تفاصيل كتابة شرح المتجر الالكتروني
            وموقع القطاع تفاصيل كتابة شرح المتجر الالكتروني وموقع القطاع تفاصيل كتابة شرح المتجر
            الالكتروني وموقع القطاع.
          </p>
          
          <div className="marketplace__actions">
            <Link to="/sectors/advertising/marketplace" className="marketplace__btn marketplace__btn--primary">
              المتجر الالكتروني
            </Link>
            <Link to="/sectors/advertising" className="marketplace__btn marketplace__btn--secondary">
              موقع القطاع
            </Link>
          </div>
        </div>

        {/* ── Left Side Graphic Carousel ── */}
        <div className="marketplace__graphic">
          <div className="marketplace__gif-placeholder">
            <div 
              className="marketplace__carousel"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div 
                className="marketplace__carousel-track" 
                ref={trackRef}
                style={{ transform: `translateX(${-1296}px)` }}
              >
                {[...products, ...products].map((p, idx) => {
                  const hasDims = p.width || p.height || p.length;
                  return (
                    <article key={`${p._id || idx}-${idx}`} className="marketplace__card">
                      <div className="marketplace__card-media">
                        <img src={p.animationMedia || p.mainImage} alt={p.name} />
                        {p.onDemand && <span className="marketplace__card-badge">حسب الطلب</span>}
                      </div>
                      <div className="marketplace__card-body">
                        <span className="marketplace__card-cat">{p.category}</span>
                        <h3 className="marketplace__card-title">{p.name}</h3>
                        <div className="marketplace__card-meta">
                          <span className="marketplace__card-dims" dir="ltr">
                            {hasDims ? (
                              `${[p.width, p.height, p.length].filter(Boolean).join(' × ')} cm`
                            ) : (
                              "مقاسات مخصصة"
                            )}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
