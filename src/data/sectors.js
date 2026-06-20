/**
 * Hamza Advanced — Sector registry.
 * Order follows the importance ranking the client gave (most important first).
 * The "main" entry represents the Hamza Advanced umbrella brand and is the
 * default state of the homepage hero. In RTL the first card in the array
 * appears on the right, exactly as the brief requires.
 */

export const SECTORS = [
  {
    id: 'main',
    key: 'main',
    name: 'الهمزة المتطورة',
    tagline: 'عالم من الخيارات',
    short: 'بيت خدمات متكامل تحت هوية موحدة',
    description:
      'مؤسسة سعودية تعمل ضمن أنظمة ولوائح رسمية، تجمع تحت مظلتها خمسة قطاعات تخدم العميل من الفكرة إلى التنفيذ.',
    services: ['الإستراتيجية', 'التنفيذ', 'الإدارة الموحدة', 'الجودة والسرعة'],
    color: '#13BD84',
    colorSoft: '#2BD89A',
    colorDeep: '#0E9968',
    contrast: '#ffffff',
    sectorAttr: null, // null = default (uses primary palette)
    href: '/',
  },
  {
    id: 'ads',
    key: 'ads',
    name: 'الدعاية والإعلان',
    tagline: 'حضور بصري لا يُنسى',
    short: 'حلول دعائية تعزّز الحضور',
    description:
      'من التصميم والإنتاج الدعائي إلى الطباعة واللافتات — حلول إعلانية مبتكرة تترجم الفكرة إلى أثر بصري ملموس.',
    services: ['تصميم وهوية', 'طباعة ولافتات', 'حملات بصرية', 'إنتاج دعائي'],
    color: '#FEFC4F',
    colorSoft: '#FFFD80',
    colorDeep: '#D6D32A',
    contrast: '#0B1220',
    sectorAttr: 'ads',
    href: '/sectors/advertising',
  },
  {
    id: 'events',
    key: 'events',
    name: 'إدارة وإقامة الفعاليات',
    tagline: 'تألق بفعالياتك معنا',
    short: 'رمز الامتياز لفعالياتكم',
    description:
      'إدارة لوجستية كاملة للفعاليات والمؤتمرات والمعارض والمناسبات الرسمية، بمنهجية علمية صارمة وفِرَق متخصصة.',
    services: ['تخطيط الفعاليات', 'إقامة وتنسيق', 'إدارة لوجستية', 'بروتوكول رسمي'],
    color: '#EE4266',
    colorSoft: '#F26A85',
    colorDeep: '#B81F40',
    contrast: '#ffffff',
    sectorAttr: 'events',
    href: '/sectors/events',
  },
  {
    id: 'electric',
    key: 'electric',
    name: 'الكهرباء',
    tagline: 'عالم من الطاقة',
    short: 'الكهرباء ليه مختصين',
    description:
      'توريد وصيانة الأنظمة الكهربائية الحرجة — مولّدات، أنظمة UPS، مفاتيح تحويل آلية، ولوحات تحكم — للقطاعين التجاري والحكومي.',
    services: ['توريد المعدات', 'الصيانة الدورية', 'التركيب والتشغيل', 'الاستشارات الهندسية'],
    color: '#008CFF',
    colorSoft: '#4DA8FF',
    colorDeep: '#0066C7',
    contrast: '#ffffff',
    sectorAttr: 'electric',
    href: '/sectors/electricity',
  },
  {
    id: 'travel',
    key: 'travel',
    name: 'السفر والسياحة',
    tagline: 'إلى كل وجهة، باتجاه واحد: راحتك',
    short: 'برامج سفر وسياحة',
    description:
      'تصميم رحلات داخلية وخارجية، حجوزات، وإدارة برامج سياحية مخصّصة للأفراد والمجموعات.',
    services: ['حجوزات طيران', 'باقات سياحية', 'تأشيرات', 'رحلات مؤسسية'],
    color: '#2ADBD6',
    colorSoft: '#8BE7F2',
    colorDeep: '#2FA9B8',
    contrast: '#0B1220',
    sectorAttr: 'travel',
    href: '/sectors/travel',
  },
  {
    id: 'catering',
    key: 'catering',
    name: 'التموين والإعاشة',
    tagline: 'ضيافة بمعايير راقية',
    short: 'خدمات تموين وإعاشة',
    description:
      'خدمات إطعام مؤسسي وتموين فعاليات بمعايير صحية مرتفعة، وقوائم متنوعة تناسب كل مناسبة.',
    services: ['تموين مؤسسي', 'بوفيهات الفعاليات', 'وجبات يومية', 'تخطيط القوائم'],
    color: '#D79F56',
    colorSoft: '#E9C285',
    colorDeep: '#A87D3F',
    contrast: '#0B1424',
    sectorAttr: 'catering',
    href: '/sectors/catering',
  },
];

export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map(s => [s.id, s]));
