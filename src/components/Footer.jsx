import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'motion/react';
import { HamzaWordmark } from './BrandMarks.jsx';
import { SECTORS } from '../data/sectors.js';
import '../styles/footer.css';

/* Sector entries (excluding umbrella brand) for the footer links */
const SECTOR_ENTRIES = SECTORS.filter(s => s.id !== 'main');

export default function Footer() {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const animateRandomly = async () => {
      while (isMounted) {
        // Precise max up value and min down value (in pixels)
        const maxUp = -60; 
        const minDown = 40; 
        
        const randomY = Math.random() * (minDown - maxUp) + maxUp;
        
        // Random blur between 4px and 24px
        const randomBlur = Math.random() * 32 + 8;
        
        // Random duration for smooth, organic floating effect (between 3s and 6s)
        const randomDuration = Math.random() * 1 + 1;

        await controls.start({
          y: randomY,
          filter: `blur(${randomBlur}px)`,
          transition: { duration: randomDuration, ease: "easeInOut" }
        });
      }
    };

    animateRandomly();

    return () => {
      isMounted = false;
      controls.stop();
    };
  }, [controls]);

  return (
    <footer className="footer" dir="rtl">
      {/* Background Graphic SVG */}
      <motion.img 
        src="/images/footer%20icon/footer%20graphic.svg" 
        alt="" 
        className="footer__graphic" 
        animate={controls}
      />

      <div className="footer__inner">
        {/* ── Top Grid ── */}
        <div className="footer__grid">
          
          {/* Column 1: Logo & Info */}
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__logo-link">
              <HamzaWordmark dark />
            </Link>
            <p className="footer__desc">
              الهمزة المتطورة®<br />
              مؤسسة ذات هيكل احادي، تقدم<br />
              خدمات متنوعة في خمسة قطاعات،<br />
              ضمن أنظمة ولوائح رسمية.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Snapchat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.128 1.411c-1.921 0-3.722.684-5.066 1.928-1.341 1.243-2.079 2.894-2.079 4.654 0 1.272.235 2.146.404 2.683.051.157.086.27.098.347-1.127.357-1.895.918-2.26 1.65-.246.495-.27 1.059-.065 1.545.241.571.745.894 1.344 1.056.28.077.587.112.871.125l.08.004c-.066.368-.138.868-.182 1.464-.17 2.308.572 3.86 2.136 4.475.29.114.615.176.953.181-.144.17-.265.368-.352.593-.207.541-.122 1.134.225 1.574.349.444.887.683 1.439.638 1.282-.107 2.408-.543 3.344-1.294.618-.497 1.127-1.077 1.522-1.742.395.665.904 1.245 1.522 1.742.936.751 2.062 1.187 3.344 1.294.552.045 1.09-.194 1.439-.638.347-.44.432-1.033.225-1.574-.087-.225-.208-.423-.352-.593.338-.005.663-.067.953-.181 1.564-.615 2.306-2.167 2.136-4.475-.044-.596-.116-1.096-.182-1.464l.08-.004c.284-.013.591-.048.871-.125.599-.162 1.103-.485 1.344-1.056.205-.486.181-1.05-.065-1.545-.365-.732-1.133-1.293-2.26-1.65.012-.077.047-.19.098-.347.169-.537.404-1.411.404-2.683 0-1.76-.738-3.411-2.079-4.654-1.344-1.244-3.145-1.928-5.066-1.928z"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Parent Company */}
          <div className="footer__col">
            <h4 className="footer__col-title">مؤسسة الهمزة المتطورة</h4>
            <ul className="footer__nav">
              <li><a href="#about" className="footer__link">حول المؤسسة</a></li>
              <li><Link to="/contact" className="footer__link">تواصل معنا</Link></li>
              <li><a href="#projects" className="footer__link">محفظة اعمالنا</a></li>
              <li><a href="#" className="footer__link">سياسة الخصوصية</a></li>
              <li><a href="#" className="footer__link">الشروط والاحكام</a></li>
            </ul>
          </div>

          {/* Column 3: Sectors */}
          <div className="footer__col">
            <h4 className="footer__col-title">قطاعات الهمزة المتطورة</h4>
            <ul className="footer__nav">
              {SECTOR_ENTRIES.map(s => (
                <li key={s.id}>
                  <Link
                    to={s.href}
                    className="footer__link footer__link--sector"
                    style={{ '--hover-color': s.color }}
                  >
                    {s.name}
                    {(s.id === 'travel' || s.id === 'catering') && (
                      <span className="footer__badge" style={{ '--badge-color': s.color }}>حديث</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Vision 2030 */}
          <div className="footer__col">
            <h4 className="footer__col-title">رؤية2030 - نحو المستقبل</h4>
            <ul className="footer__nav">
              <li><a href="#vision" className="footer__link">برنامج رؤية2030</a></li>
              <li><Link to="/vision2030" className="footer__link">التزاماتنا مع رؤية2030</Link></li>
              <li>
                <a href="https://www.vision2030.gov.sa/" target="_blank" rel="noopener noreferrer" className="footer__link footer__link--external">
                  موقع برنامج رؤية2030
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="17" x2="7" y2="7"></line>
                    <polyline points="17 7 7 7 7 17"></polyline>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">© الهمزة المتطورة 2026® — جميع الحقوق محفوظة.</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__link">العنوان</a>
            <a href="#" className="footer__link">الهاتف</a>
            <a href="#" className="footer__link">البريد الإلكتروني</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
