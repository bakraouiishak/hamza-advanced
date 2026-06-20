/**
 * Hamza Advanced — Electricity sector content.
 * Sourced from the old "Hmzah Wasl" business profile (Vision / Mission /
 * Services / Partners). Brand voice retuned for the new "Hamza Advanced —
 * Electricity" identity (blue, dark navy, energy-grid).
 */

export const EL_BRAND = {
  divisionName: 'الهمزة المتطورة — للكهرباء',
  tagline: 'عالم من الطاقة',
  promise: 'الكهرباء ليه مختصين.',
  short:
    'روّاد أعمال الصيانة والتوريد في مجال الكهرباء — نُهيّئ بيئة هندسية تنافسية بأفضل الخدمات والمنتجات وبأسعار لا تُنافس.',
  pitch:
    'مؤسسة سعودية متخصصة في توريد وصيانة الأنظمة الكهربائية الحرجة — مولّدات، أنظمة UPS، مفاتيح تحويل آلية، ولوحات تحكم — لقطاعات الأعمال والمنشآت الحكومية.',
  contact: {
    phone: '0598102407',
    email: 'info@Hmza-Wasl.com',
    website: 'hmza-advanced.com',
    address: 'جدة — حي الفيصلية — برج الياسمين',
  },
};

/* Vision / Mission / Goal — verbatim translation of p.2 of the old profile */
export const EL_PILLARS = [
  {
    id: 'vision',
    label: 'الرؤية',
    title: 'روّاد أعمال الصيانة والتوريد في مجال الكهرباء',
    body: 'نسعى لأن نكون المرجع الأول للمنشآت التي لا تحتمل انقطاع الطاقة — بفريق هندسي مُعتمد ومخزون قطع غيار جاهز على مدار الساعة.',
  },
  {
    id: 'mission',
    label: 'الرسالة',
    title: 'تهيئة بيئة هندسية تنافسية',
    body: 'نطوّر المشهد العام للقطاع بأقل الأسعار وأفضل الخدمات والمنتجات — التزام كامل بمعايير السلامة الكهربائية ومدوّنات البناء السعودية.',
  },
  {
    id: 'goal',
    label: 'الهدف',
    title: 'استمرارية تشغيل لا تعرف التوقّف',
    body: 'حلول طاقة متكاملة — توريد، تركيب، اختبار، تشغيل وصيانة — تحت إشراف مهندسين معتمدين، لضمان جاهزية كاملة لمنشأتك في كل لحظة.',
  },
];

/* Services — four pillars of the old profile (Supplying / Maintenance /
   Installation, Testing & Commissioning / Consultancy) — expanded into
   eight client-facing service cards for the grid. */
export const EL_SERVICES = [
  {
    id: 'generators',
    icon: 'generator',
    title: 'توريد المولّدات الديزل',
    short: 'PERKINS وما يعادلها',
    body: 'مولّدات ديزل احتياطية للمنشآت التجارية والحكومية — توريد، تشغيل، وضمان شامل من الوكيل المعتمد.',
  },
  {
    id: 'ups',
    icon: 'ups',
    title: 'أنظمة UPS الإلكترونية',
    short: 'ServoMatik — من 1000VA إلى 800kVA',
    body: 'أنظمة طاقة غير منقطعة Online UPS لحماية الأحمال الحرجة — مراكز البيانات، غرف العمليات، والمختبرات.',
  },
  {
    id: 'ats',
    icon: 'switch',
    title: 'مفاتيح التحويل الآلية ATS',
    short: 'SCHNEIDER — من 30A حتى 4000A',
    body: 'مفاتيح تحويل أوتوماتيكية بين مصادر التغذية الأساسية والاحتياطية — تكامل كامل مع المولّد ولوحات التوزيع.',
  },
  {
    id: 'batteries',
    icon: 'battery',
    title: 'توريد البطاريات',
    short: 'Sprinter • Yuasa • Long • Nova',
    body: 'بطاريات صناعية لأنظمة UPS والمولّدات — اختيار السعة المناسبة لكل تطبيق، مع خدمة التركيب والإحلال.',
  },
  {
    id: 'maintenance',
    icon: 'wrench',
    title: 'عقود الصيانة الوقائية والعلاجية',
    short: 'PPM + CM سنوية',
    body: 'عقود صيانة دورية لأنظمة UPS (APC, Liebert, Chloride, Salicru…) والمولّدات (Caterpillar, Cummins, Perkins, Volvo) وغرف الكهرباء.',
  },
  {
    id: 'installation',
    icon: 'install',
    title: 'التركيب والاختبار والتشغيل',
    short: 'Installation • Testing • Commissioning',
    body: 'فريق فني مدرّب يتولى تركيب التمديدات الكهربائية، اختبار العزل، وتشغيل الأنظمة وفق معايير IEC و SBC.',
  },
  {
    id: 'panels',
    icon: 'panel',
    title: 'لوحات التحكم والتوزيع',
    short: 'MDB • SMDB • DB',
    body: 'تجميع وتوريد لوحات التوزيع الرئيسية والفرعية — اختيار قواطع وفق حسابات الحمل، مع كل وثائق الاختبار.',
  },
  {
    id: 'consultancy',
    icon: 'consult',
    title: 'الاستشارات الهندسية',
    short: 'مهندسون معتمدون',
    body: 'مهندسون معتمدون يقدّمون حلولاً للتحديات الكهربائية والإلكترونية وأعمال البناء — تدقيق المخططات وحساب الأحمال.',
  },
];

/* Values — extracted from profile tone: safety, reliability, expertise,
   competitive pricing. Kept short for grid display. */
export const EL_VALUES = [
  {
    id: 'safety',
    title: 'السلامة أولاً',
    body: 'التزام صارم بمدوّنة البناء السعودية SBC ومعايير IEC في كل تركيبة كهربائية — حماية الأشخاص قبل المعدات.',
  },
  {
    id: 'continuity',
    title: 'استمرارية التشغيل',
    body: 'أنظمة احتياطية مكرّرة، اختبارات تشغيل دوريّة، وفرق طوارئ جاهزة — لأن انقطاع الطاقة ليس خيارًا.',
  },
  {
    id: 'expertise',
    title: 'كفاءة هندسية معتمدة',
    body: 'فريق من المهندسين والفنيين المدرّبين على أنظمة كبرى الشركات العالمية — Schneider, APC, Liebert, Caterpillar.',
  },
  {
    id: 'competitive',
    title: 'أسعار لا تُنافس',
    body: 'بيئة عمل تنافسية بأفضل الأسعار وأفضل الخدمات — هدفنا تطوير المشهد العام، لا تعظيم الربح فحسب.',
  },
];

/* Promise stats — placeholder figures aligned with company tenure */
export const EL_PROMISE = [
  {
    stat: '11+',
    statLabel: 'سنوات خبرة',
    title: 'في توريد وصيانة الطاقة',
    body: 'منذ التأسيس ونحن نخدم المنشآت الحرجة في المملكة بفريق متخصص في كل ما يخص الكهرباء.',
  },
  {
    stat: '24/7',
    statLabel: 'دعم فني',
    title: 'طوارئ كهربائية على مدار الساعة',
    body: 'فرق صيانة جاهزة للاستجابة لأعطال الأنظمة الحرجة في أي وقت — لأن الزمن أهم من المال عند انقطاع الطاقة.',
  },
  {
    stat: '08',
    statLabel: 'أقسام تخصصية',
    title: 'مظلّة خدمات متكاملة',
    body: 'توريد، تركيب، اختبار، تشغيل، صيانة، استشارات، لوحات تحكم، وأنظمة طاقة احتياطية — تحت سقف واحد.',
  },
  {
    stat: '100%',
    statLabel: 'التزام نظامي',
    title: 'مدوّنات البناء السعودية',
    body: 'كل تركيبة تخرج من فرقنا تستوفي اشتراطات SBC ومتطلبات شركة الكهرباء السعودية SEC.',
  },
];
