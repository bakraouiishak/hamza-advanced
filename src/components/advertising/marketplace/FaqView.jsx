import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../lib/auth.jsx';

/**
 * FaqView — public-facing Frequently Asked Questions for the advertising
 * marketplace. Accessible to both guests and signed-in users (no auth gate).
 * Categories: ordering, payments & quotes, design files, delivery, returns,
 * account.
 */

const FAQ_GROUPS = [
  {
    id: 'orders',
    title: 'الطلبات والتجهيز',
    eyebrow: 'كيفية الطلب',
    items: [
      {
        q: 'كيف أطلب منتجًا من السوق؟',
        a: 'تصفّح الفئات أو ابحث عن منتج محدد، ثم أضِفه إلى سلتك. في صفحة إتمام الطلب أدخِل المقاسات والمواصفات وأرفع ملف التصميم (إن وُجد)، وأخيرًا اضغط "طلب المنتجات" لإرسال الطلب إلى فريق الإدارة للمراجعة والتسعير.',
      },
      {
        q: 'ما الفرق بين المنتج بسعر ثابت والمنتج "حسب الطلب"؟',
        a: 'المنتجات بسعر ثابت تُعرض بسعر القطعة مباشرة وتُحتسب آليًا. المنتجات حسب الطلب تتطلب مقاسات أو خامات مخصصة، ويُقدَّم لها سعر مخصّص من فريق الإدارة بعد مراجعة تفاصيل طلبك.',
      },
      {
        q: 'هل يوجد حد أدنى لعدد القطع في الطلب؟',
        a: 'يختلف الحد الأدنى من منتج لآخر. ستجد العدد الأدنى مكتوبًا داخل صفحة المنتج وعند إضافته للسلة، وسيمنعك النظام من إرسال الطلب إذا كانت الكمية أقل.',
      },
      {
        q: 'هل يمكنني تعديل الطلب بعد إرساله؟',
        a: 'قبل بدء الإدارة بتجهيز الطلب يمكن التعديل بالتواصل مع فريق الدعم. بعد البدء بالإنتاج لا يمكن التعديل لتفادي إعادة العمل.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'الأسعار والدفع',
    eyebrow: 'التسعير',
    items: [
      {
        q: 'متى أعرف السعر النهائي لطلبي؟',
        a: 'للمنتجات بسعر ثابت يظهر السعر مباشرة في السلة. للمنتجات حسب الطلب يقدّم فريق الإدارة عرض السعر بعد مراجعة الطلب — عادةً خلال يوم عمل واحد.',
      },
      {
        q: 'ما طرق الدفع المتاحة؟',
        a: 'يتم الاتفاق على طريقة الدفع مباشرة مع فريق الإدارة بعد قبول عرض السعر. ندعم التحويل البنكي والمدى وبطاقات الائتمان للحسابات المؤسسية.',
      },
      {
        q: 'هل الأسعار شاملة الضريبة؟',
        a: 'تُحتسب ضريبة القيمة المضافة (15%) منفصلة على الفاتورة النهائية بحسب الأنظمة السعودية.',
      },
    ],
  },
  {
    id: 'design',
    title: 'ملفات التصميم',
    eyebrow: 'الجاهزية الفنية',
    items: [
      {
        q: 'ما الصيغ المقبولة لملفات التصميم؟',
        a: 'نقبل الصيغ SVG و EPS و PDF و AI بحجم أقصى 25 ميجابايت لكل ملف. تأكد من أن الألوان بنظام CMYK لطباعة دقيقة، وأن جميع الخطوط محوّلة إلى مسارات.',
      },
      {
        q: 'ماذا لو لم يكن لديّ تصميم جاهز؟',
        a: 'فريق التصميم لدينا يستطيع إنجاز التصميم لك. أضف ملاحظتك في حقل التفاصيل عند الطلب، أو ابدأ بطلب خدمة "التصاميم والهويات البصرية" من الفئات.',
      },
      {
        q: 'كيف أضمن جودة الطباعة؟',
        a: 'نوصي بدقة لا تقل عن 300 DPI للصور، واستخدام مساحة هامش (Bleed) 3 مم على الأقل. فريقنا يفحص ملفك قبل الطباعة ويتواصل معك عند الحاجة.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'التسليم والشحن',
    eyebrow: 'الجداول الزمنية',
    items: [
      {
        q: 'كم تستغرق مدة التنفيذ؟',
        a: 'تظهر مدة التنفيذ في كل صفحة منتج: "يوم واحد"، "اسبوع"، أو عدد أيام محدد. تبدأ المدة بعد اعتماد التصميم واستلام الدفعة الأولى.',
      },
      {
        q: 'هل تقدمون خدمة التسليم؟',
        a: 'نوفر التسليم داخل جدة، مكة المكرمة، والرياض. للمواقع الأخرى نتعاون مع شركات شحن معتمدة. تُحسب رسوم الشحن في عرض السعر النهائي.',
      },
      {
        q: 'هل يمكنني الاستلام من المكتب مباشرة؟',
        a: 'نعم، يمكن الاستلام من مكتبنا في جدة - حي الفيصلية - مركز الياسمين التجاري - مكتب رقم 201، بعد إشعارك بجاهزية الطلب.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'الاسترجاع والضمان',
    eyebrow: 'سياسات الجودة',
    items: [
      {
        q: 'ما سياسة الاسترجاع؟',
        a: 'بحكم طبيعة المنتجات المخصّصة (طباعة مخصصة، تصاميم بهوية محددة) لا تقبل الاسترجاع بعد الإنتاج. لكن إذا وُجد عيب تصنيع نتحمّل المسؤولية كاملة بإعادة التنفيذ أو استرداد المبلغ.',
      },
      {
        q: 'ماذا أفعل إذا تأخر طلبي؟',
        a: 'تواصل مع فريق الدعم عبر رقم الهاتف أو البريد الإلكتروني. كل طلب له مسؤول تنفيذ محدد يتابع جدوله الزمني.',
      },
    ],
  },
  {
    id: 'account',
    title: 'الحساب والأمان',
    eyebrow: 'حسابك',
    items: [
      {
        q: 'هل أحتاج لإنشاء حساب لطلب المنتجات؟',
        a: 'نعم، إنشاء حساب يسمح لك بحفظ مفضّلاتك، متابعة طلباتك، وحفظ تفاصيل التواصل لطلبات أسرع لاحقًا.',
      },
      {
        q: 'كيف أحدّث بياناتي الشخصية؟',
        a: 'من قائمة "حسابي" يمكنك تعديل اسمك، رقم الجوال، البريد الإلكتروني، والصورة الشخصية في أي وقت.',
      },
      {
        q: 'هل بياناتي آمنة؟',
        a: 'نعم. كلمات المرور مُشفّرة بالكامل، ولا نشارك بياناتك مع أي طرف ثالث. تواصل معنا أو سياسة الخصوصية للمزيد.',
      },
    ],
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`mk-faq__item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="mk-faq__q"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="mk-faq__q-text">{item.q}</span>
        <span className="mk-faq__chevron" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className="mk-faq__a" role="region">
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function FaqView() {
  const { user } = useAuth();
  const [openKey, setOpenKey] = useState('orders-0'); // first question of first group open by default
  const [activeGroup, setActiveGroup] = useState('orders');

  const toggle = (key) => setOpenKey((p) => (p === key ? null : key));

  return (
    <section className="mk-faq">
      {/* HERO */}
      <div className="mk-faq__hero">
        <div className="mk-faq__hero-inner">
          <span className="mk-faq__eyebrow">مركز المساعدة</span>
          <h1 className="mk-faq__title">
            تساؤلاتكم، <span className="mk-faq__title-hl">إجاباتنا.</span>
          </h1>
          <p className="mk-faq__sub">
            جمعنا أكثر الأسئلة شيوعًا من عملائنا حول الطلب، التسعير، ملفات
            التصميم، التسليم، والاسترجاع. لم تجد إجابتك؟ تواصل معنا مباشرة.
          </p>
          <div className="mk-faq__hero-cta">
            <Link to="/contact" className="mk-faq__cta mk-faq__cta--primary">
              تواصل معنا
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {!user && (
              <Link to="/sectors/advertising/marketplace/signup" className="mk-faq__cta mk-faq__cta--ghost">
                إنشاء حساب
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* BODY — sidebar + accordion */}
      <div className="mk-faq__body">
        <div className="mk-faq__body-inner">
          {/* Category nav (sticky on desktop, horizontal scroll on mobile) */}
          <aside className="mk-faq__nav" aria-label="فئات الأسئلة">
            {FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#faq-${g.id}`}
                className={`mk-faq__nav-link ${activeGroup === g.id ? 'is-active' : ''}`}
                onClick={() => setActiveGroup(g.id)}
              >
                <span className="mk-faq__nav-eyebrow">{g.eyebrow}</span>
                <span className="mk-faq__nav-title">{g.title}</span>
                <span className="mk-faq__nav-count">{g.items.length}</span>
              </a>
            ))}
          </aside>

          {/* Accordion list */}
          <div className="mk-faq__list">
            {FAQ_GROUPS.map((g) => (
              <section key={g.id} id={`faq-${g.id}`} className="mk-faq__group">
                <header className="mk-faq__group-head">
                  <span className="mk-faq__group-eyebrow">{g.eyebrow}</span>
                  <h2 className="mk-faq__group-title">{g.title}</h2>
                </header>
                <div className="mk-faq__items">
                  {g.items.map((item, i) => {
                    const key = `${g.id}-${i}`;
                    return (
                      <FaqItem
                        key={key}
                        item={item}
                        isOpen={openKey === key}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Footer card — escalation */}
            <div className="mk-faq__more">
              <div>
                <h3>لا زالت لديك أسئلة؟</h3>
                <p>فريق الدعم متاح طوال أيام العمل للرد على استفساراتك.</p>
              </div>
              <Link to="/contact" className="mk-faq__cta mk-faq__cta--primary">
                تواصل معنا
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
