import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

/**
 * Infinite horizontal scrolling partner logo carousel.
 * - Draggable with mouse, seamlessly wrapping.
 * - Pauses with a gentle ease-out when hovered, resumes with ease-in.
 */

const LOGOS = [
  { src: '/images/partners logos/almawaddah-charity 1.png', alt: 'Almawaddah Charity' },
  { src: '/images/partners logos/athar-entreprise 1.png', alt: 'Athar Entreprise' },
  { src: '/images/partners logos/isuzu-seeklogo 1.png', alt: 'Isuzu' },
  { src: '/images/partners logos/king-saud-university 1.png', alt: 'King Saud University' },
  { src: '/images/partners logos/ministry-of-education 1.png', alt: 'Ministry of Education' },
  { src: '/images/partners logos/ministry-of-municipal 1.png', alt: 'Ministry of Municipal' },
  { src: '/images/partners logos/ministry-of-tourism 1.png', alt: 'Ministry of Tourism' },
  { src: '/images/partners logos/saudi-ministry-of-sport-seeklogo 1.png', alt: 'Ministry of Sport' },
  { src: '/images/partners logos/sela-entreprise 1.png', alt: 'Sela Entreprise' },
  { src: '/images/partners logos/waad-academy 1.png', alt: 'Waad Academy' },
];

export default function PartnersCarousel() {
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [setWidth, setSetWidth] = useState(0);

  // Motion value to drive the track position manually
  const x = useMotionValue(0);

  // Speed multiplier: 1 is full speed, 0 is stopped.
  const speedRef = useRef(1);
  const baseVelocity = 60; // Pixels per second. Positive moves to the right.

  // We duplicate the logo set 4× to guarantee seamless wrapping at any width
  const repeatedLogos = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        // The track has 4 copies of LOGOS. 1 copy is scrollWidth / 4.
        setSetWidth(trackRef.current.scrollWidth / 4);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useAnimationFrame((time, delta) => {
    if (setWidth === 0) return;

    // Target speed: 0 if hovered or dragging, else 1
    const targetSpeed = isHovered || isDragging ? 0 : 1;
    
    // Smooth transition (ease-in-out gentle motion)
    speedRef.current += (targetSpeed - speedRef.current) * (delta * 0.003);

    // Only apply automated continuous scroll if not actively dragging
    let moveBy = 0;
    if (!isDragging) {
      moveBy = speedRef.current * baseVelocity * (delta / 1000);
    }

    let currentX = x.get() + moveBy;

    // Wrap around logic to make the carousel infinite.
    if (currentX >= setWidth) {
      currentX -= setWidth;
    } else if (currentX <= -setWidth) {
      currentX += setWidth;
    }

    x.set(currentX);
  });

  return (
    <section id="portfolio" className="partners-carousel" dir="rtl">
      <p className="partners-carousel__caption">تعرف على شركاؤنا</p>

      <div className="partners-carousel__mask">
        <motion.div
          ref={trackRef}
          className="partners-carousel__track"
          style={{ x }}
          drag="x"
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {repeatedLogos.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="partners-carousel__item"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="partners-carousel__logo"
                draggable="false"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
