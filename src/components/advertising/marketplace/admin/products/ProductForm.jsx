import React, { useState } from 'react';
import { api } from '../../../../../lib/api.js';
import SaudiRiyal from '../../SaudiRiyal.jsx';

/* Mirror of the backend Product model's category enum. Kept in sync by hand
   for now — easy to lift to a shared constants file later. */
const CATEGORIES = [
  'إدارة الفعاليات والمؤتمرات والمعارض',
  'المطبوعات الورقية',
  'علب المنتجات والتغليف',
  'الأكياس الورقية والبلاستيكية',
  'الحروف البارزة',
  'الهدايا الدعائية والدروع',
  'أعمال الاكريليك والفوركس والخشب',
  'الاستكرات والبنرات واللوحات الدعائية',
  'الطباعة المباشرة على المواد UV',
  'التصاميم والهويات البصرية',
  'الاستاندات وطاولات العرض والأعلام',
  'الزي الموحد',
];

/**
 * ProductForm — handles both ADD and EDIT.
 *   • mainImage    — always an image; the static state on marketplace cards.
 *   • animationMedia — image OR short video; revealed on hover. Videos
 *     autoplay muted-looped, so a hover-reveal motion clip is supported for
 *     products where a still hover frame isn't enough (e.g. the Motion
 *     Design product). The backend (productRoutes.js) inspects the MIME of
 *     each uploaded file and routes it to the right Cloudinary pipeline.
 *   • Cloudinary compresses everything to brand-safe sizes on upload.
 */
export default function ProductForm({ initial = null, onSaved, onCancel }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name:         initial?.name        || '',
    reference:    initial?.reference   || '',
    category:     initial?.category    || CATEGORIES[0],
    price:        initial?.price       ?? '',
    prodTime:     initial?.prodTime    || 'يوم واحد',
    description:  initial?.description || '',
    onDemand:     initial?.onDemand    ?? false,
    width:        initial?.width       ?? '',
    height:       initial?.height      ?? '',
    length:       initial?.length      ?? '',
    minimumOrder: initial?.minimumOrder ?? 1,
  });
  const [mainFile, setMainFile] = useState(null);
  const [animFile, setAnimFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        // Skip the price field entirely for on-demand products so the
        // schema's conditional validator stays happy.
        if (k === 'price' && form.onDemand) return;
        // Skip empty dimensions; the backend treats them as null.
        if (['width', 'height', 'length'].includes(k) && (v === '' || v == null)) return;
        if (v === '' || v === null || v === undefined) return;
        fd.append(k, v);
      });
      if (mainFile) fd.append('mainImage', mainFile);
      if (animFile) fd.append('animationMedia', animFile);

      // On create, both files are required; on edit, only if changed.
      if (!isEdit && (!mainFile || !animFile)) {
        throw new Error('يجب رفع ملفين: الصورة الرئيسية وصورة/فيديو التحويم.');
      }

      const saved = isEdit
        ? await api.patch(`/products/${initial.id || initial._id}`, fd)
        : await api.post('/products', fd);

      onSaved?.(saved);
    } catch (err) {
      setError(err.message || 'تعذّر الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="adm-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="adm-form__error">{error}</div>}

      <div className="adm-form__row">
        <label className="adm-field">
          <span>اسم المنتج</span>
          <input value={form.name} onChange={set('name')} required dir="rtl" maxLength={120} />
        </label>
        <label className="adm-field">
          <span>المرجع (Reference)</span>
          <input value={form.reference} onChange={set('reference')} required dir="ltr" placeholder="ABC-001" />
        </label>
      </div>

      <div className="adm-form__row">
        <label className="adm-field">
          <span>الفئة</span>
          <select value={form.category} onChange={set('category')} required>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="adm-field">
          <span>الحد الأدنى للطلب</span>
          <input
            type="number"
            min="1"
            step="1"
            value={form.minimumOrder}
            onChange={set('minimumOrder')}
            required
            dir="ltr"
          />
          <small className="adm-field__hint">
            أقل كمية يمكن للعميل طلبها (مثلاً: ٥٠ كرت شخصي).
          </small>
        </label>
      </div>

      {/* On-demand toggle — drives the conditional UI below */}
      <label className="adm-field" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.6rem' }}>
        <input
          type="checkbox"
          checked={form.onDemand}
          onChange={set('onDemand')}
          style={{ width: 18, height: 18, marginTop: 4, accentColor: 'var(--ad-yellow)' }}
        />
        <div>
          <span style={{ display: 'block', marginBottom: 2 }}>منتج حسب الطلب (مقاسات مخصصة)</span>
          <small className="adm-field__hint" style={{ marginTop: 0 }}>
            فعّل هذا الخيار للمنتجات التي تختلف مقاساتها وأسعارها حسب طلب العميل
            (مثل الحروف البارزة، أكشاك الفعاليات، الدروع). لن تحتاج لإدخال سعر،
            ولن يتمكن العميل من إتمام الطلب قبل أن يقدّم الإدارة عرض السعر.
          </small>
        </div>
      </label>

      {/* Price + dimensions — hidden for on-demand */}
      {!form.onDemand && (
        <>
          <div className="adm-form__row">
            <label className="adm-field">
              <span>السعر الثابت (<SaudiRiyal />)</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={set('price')}
                required
                dir="ltr"
              />
            </label>
            <label className="adm-field">
              <span>العرض (سم) — اختياري</span>
              <input type="number" step="0.1" min="0.1" value={form.width} onChange={set('width')} dir="ltr" />
            </label>
          </div>
          <div className="adm-form__row">
            <label className="adm-field">
              <span>الارتفاع (سم) — اختياري</span>
              <input type="number" step="0.1" min="0.1" value={form.height} onChange={set('height')} dir="ltr" />
            </label>
            <label className="adm-field">
              <span>الطول / العمق (سم) — اختياري</span>
              <input type="number" step="0.1" min="0.1" value={form.length} onChange={set('length')} dir="ltr" />
            </label>
          </div>
          <small className="adm-field__hint" style={{ marginTop: -8 }}>
            املأ المقاسات المعروفة فقط (مثل A4، كرت شخصي). اترك الباقي فارغًا.
          </small>
        </>
      )}

      {form.onDemand && (
        <div className="adm-form__error" style={{ background: 'rgba(254,252,79,0.08)', borderColor: 'rgba(254,252,79,0.30)', color: 'var(--ad-yellow)' }}>
          💡 السعر سيُحدَّد لكل طلب على حدة بعد أن يرسل العميل مقاساته. لن تحتاج لإدخال
          سعر هنا، ولن تُعرض مقاسات افتراضية للعملاء.
        </div>
      )}

      <label className="adm-field">
        <span>زمن الإنتاج</span>
        <input
          value={form.prodTime}
          onChange={set('prodTime')}
          required
          dir="rtl"
          placeholder='"يوم واحد" أو "اسبوع" أو "3 يوم"'
          pattern="^(يوم واحد|اسبوع|[1-9]\d* يوم)$"
        />
        <small className="adm-field__hint">
          القيم المسموحة: <code>يوم واحد</code> أو <code>اسبوع</code> أو <code>&lt;عدد&gt; يوم</code>
        </small>
      </label>

      <label className="adm-field">
        <span>الوصف (اختياري)</span>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={3}
          dir="rtl"
          maxLength={4000}
        />
      </label>

      <div className="adm-form__row">
        <label className="adm-field">
          <span>الصورة الرئيسية (المنتج فارغ){isEdit ? ' — اختياري' : ''}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainFile(e.target.files?.[0] || null)}
          />
          {isEdit && initial.mainImage && !mainFile && (
            <small className="adm-field__hint">
              <a href={initial.mainImage} target="_blank" rel="noopener noreferrer">عرض الحالية</a>
            </small>
          )}
        </label>
        <label className="adm-field">
          <span>صورة أو فيديو التحويم{isEdit ? ' — اختياري' : ''}</span>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onChange={(e) => setAnimFile(e.target.files?.[0] || null)}
          />
          {isEdit && initial.animationMedia && !animFile && (
            <small className="adm-field__hint">
              <a href={initial.animationMedia} target="_blank" rel="noopener noreferrer">عرض الحالية</a>
            </small>
          )}
        </label>
      </div>
      <small className="adm-field__hint" style={{ marginTop: -8 }}>
        الصور تُضغط تلقائيًا على Cloudinary لأقل من 1 ميجابايت. الفيديو مسموح
        (MP4 / WebM، حتى 10 ميجابايت قبل الضغط) — يُفضّل أن يكون قصيرًا
        (3–5 ثوانٍ) وبدون صوت لأنه سيُشغَّل تلقائيًا ومكتومًا.
      </small>

      <div className="adm-form__actions">
        <button type="button" className="adm-btn adm-btn--ghost" onClick={onCancel}>إلغاء</button>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ…' : isEdit ? 'حفظ التغييرات' : 'إضافة المنتج'}
        </button>
      </div>
    </form>
  );
}
