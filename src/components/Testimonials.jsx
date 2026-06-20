import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Testimonials — Pure HTML/CSS Card Carousel
 *
 * - 10 testimonial cards in a horizontal carousel
 * - Active card centered with 2 stacked cards visible on each side
 * - Inactive cards are softly transparent + pushed back/downscaled
 * - Drag to navigate between cards (cards follow pointer)
 * - Infinite loop auto-play every 2 seconds
 */

const TESTIMONIALS = [
  {
    id: 1,
    sector: 'الدعاية والإعلان',
    sectorColor: '#FEFC4F',
    text: 'تعاملنا مع الهمزة المتطورة في عدة حملات إعلانية وكانت النتائج مبهرة. احترافية عالية في التصميم والتنفيذ مع التزام تام بالمواعيد.',
    name: 'أحمد الغامدي',
    role: 'مدير التسويق — شركة الوفاق',
  },
  {
    id: 2,
    sector: 'إدارة الفعاليات',
    sectorColor: '#EE4266',
    text: 'نظّمت لنا الهمزة المتطورة حفل إطلاق منتجنا الجديد بطريقة احترافية فاقت التوقعات. كل التفاصيل كانت مدروسة بعناية.',
    name: 'سارة القحطاني',
    role: 'مديرة العلاقات العامة — مجموعة النور',
  },
  {
    id: 3,
    sector: 'السفر والسياحة',
    sectorColor: '#2ADBD6',
    text: 'رحلة العمل التي نظّمتها الهمزة المتطورة لفريقنا كانت تجربة استثنائية. تنسيق ممتاز من الحجز وحتى العودة.',
    name: 'خالد المطيري',
    role: 'الرئيس التنفيذي — شركة بناء التقنية',
  },
  {
    id: 4,
    sector: 'الكهرباء',
    sectorColor: '#008CFF',
    text: 'أنجزوا لنا مشروع التمديدات الكهربائية للمبنى الجديد بكفاءة عالية وبمعايير سلامة ممتازة. شريك موثوق في البنية التحتية.',
    name: 'فهد العتيبي',
    role: 'مدير المشاريع — شركة الإنشاءات المتحدة',
  },
  {
    id: 5,
    sector: 'التموين والإعاشة',
    sectorColor: '#D79F56',
    text: 'خدمة التموين في مؤتمرنا السنوي كانت على أعلى مستوى. تنوع في القائمة وجودة في التقديم أبهرت جميع الحضور.',
    name: 'نورة الشمري',
    role: 'مديرة الفعاليات — غرفة التجارة',
  },
  {
    id: 6,
    sector: 'الدعاية والإعلان',
    sectorColor: '#FEFC4F',
    text: 'صمّموا لنا هوية بصرية متكاملة عكست رؤيتنا بشكل مثالي. فريق مبدع يفهم احتياجات السوق السعودي.',
    name: 'عبدالله الحربي',
    role: 'المؤسس — متجر رواق',
  },
  {
    id: 7,
    sector: 'إدارة الفعاليات',
    sectorColor: '#EE4266',
    text: 'تعاوننا مع الهمزة في تنظيم معرضنا الدولي كان ناجحًا بامتياز. إدارة لوجستية محكمة واهتمام بأدق التفاصيل.',
    name: 'محمد الدوسري',
    role: 'مدير العمليات — شركة المعارض السعودية',
  },
  {
    id: 8,
    sector: 'السفر والسياحة',
    sectorColor: '#2ADBD6',
    text: 'باقة السياحة الداخلية التي صمّموها لعائلتي كانت رائعة. اهتمام بالتفاصيل وخدمة عملاء متميزة طوال الرحلة.',
    name: 'ريم السبيعي',
    role: 'عميلة — برامج سياحية',
  },
  {
    id: 9,
    sector: 'الكهرباء',
    sectorColor: '#008CFF',
    text: 'فريق الصيانة الكهربائية لديهم استجابة سريعة وعمل متقن. نعتمد عليهم في جميع مشاريعنا الكهربائية.',
    name: 'ياسر الزهراني',
    role: 'مدير الصيانة — مجمع الواحة التجاري',
  },
  {
    id: 10,
    sector: 'التموين والإعاشة',
    sectorColor: '#D79F56',
    text: 'وجبات يومية لموظفينا بجودة ثابتة ومتنوعة. خدمة التموين المؤسسي من الهمزة وفّرت علينا الكثير من الجهد.',
    name: 'منى العنزي',
    role: 'مديرة الموارد البشرية — شركة أفق',
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef(null);

  // Auto-play interval
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragOffset(0);
    if (containerRef.current && e.pointerId) {
      containerRef.current.setPointerCapture?.(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diffX = dragStartX.current - currentX;
    setDragOffset(-diffX); // Move cards with pointer
  }, [isDragging]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      // Swiped left
      setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    } else if (dragOffset > 50) {
      // Swiped right
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }
    
    // Reset offset so transition smoothly snaps card to new position
    setDragOffset(0);
  }, [isDragging, dragOffset]);

  const getCardStyle = (index) => {
    const total = TESTIMONIALS.length;
    let relIndex = (index - activeIndex) % total;
    if (relIndex < 0) relIndex += total;
    
    // Map to -half to +half
    const half = Math.floor(total / 2);
    if (relIndex > half) relIndex -= total;

    const isCenter = relIndex === 0;
    const isRight1 = relIndex === -1;
    const isRight2 = relIndex === -2;
    const isLeft1 = relIndex === 1;
    const isLeft2 = relIndex === 2;

    let translateX = 0;
    let scale = 1;
    let zIndex = 5;
    let blur = 0;
    let opacity = 1;

    if (isCenter) {
      translateX = 0;
      scale = 1;
      zIndex = 5;
      blur = 0;
      opacity = 1;
    } else if (isRight1) {
      translateX = 65;
      scale = 0.85;
      zIndex = 4;
      blur = 2;
      opacity = 0.8;
    } else if (isRight2) {
      translateX = 110;
      scale = 0.7;
      zIndex = 3;
      blur = 4;
      opacity = 0.4;
    } else if (isLeft1) {
      translateX = -65;
      scale = 0.85;
      zIndex = 4;
      blur = 2;
      opacity = 0.8;
    } else if (isLeft2) {
      translateX = -110;
      scale = 0.7;
      zIndex = 3;
      blur = 4;
      opacity = 0.4;
    } else {
      translateX = relIndex > 0 ? -160 : 160;
      scale = 0.5;
      zIndex = 1;
      blur = 8;
      opacity = 0;
    }

    // Apply drag offset dynamically only to actively visible cards
    let currentDragOffset = 0;
    if (Math.abs(relIndex) <= 2) {
      currentDragOffset = dragOffset;
    }

    return {
      transform: `translateX(calc(${translateX}% + ${currentDragOffset}px)) scale(${scale})`,
      zIndex,
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: isCenter ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <section className="testimonials" id="testimonials" dir="rtl">
      <div className="testimonials__inner">
        {/* ── Header ── */}
        <div className="testimonials__header">
          <p className="testimonials__eyebrow">شهادات العملاء</p>
          <h2 className="testimonials__heading">ماذا يقول عملاؤنا عنا؟</h2>
          <p className="testimonials__body">
            نفخر بثقة عملائنا الكرام الذين يشاركوننا قصص نجاحهم. كل شهادة تعكس التزامنا
            بتقديم خدمات استثنائية عبر جميع قطاعاتنا في المملكة العربية السعودية.
          </p>
        </div>

        {/* ── HTML Carousel ── */}
        <div 
          className="testimonials__carousel" 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {TESTIMONIALS.map((t, i) => {
            const style = getCardStyle(i);
            const isActive = style.zIndex === 5; // Center card
            
            return (
              <div 
                key={t.id} 
                className={`testimonials__card ${isActive ? 'is-active' : ''}`}
                style={style}
              >
                <div 
                  className="testimonials__card-badge" 
                  style={{ backgroundColor: `${t.sectorColor}1A` }}
                >
                  <span 
                    className="testimonials__card-badge-dot" 
                    style={{ backgroundColor: t.sectorColor }}
                  />
                  <span 
                    className="testimonials__card-badge-text"
                    style={{ color: t.sectorColor }}
                  >
                    {t.sector}
                  </span>
                </div>
                
                <p className="testimonials__card-text">{t.text}</p>
                
                <div className="testimonials__card-divider" />
                
                <div className="testimonials__card-author">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
