import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Eternal Diamond Ring',
    nameAr: 'خاتم الماس الأبدي',
    description: 'A stunning 18k gold ring featuring a brilliant cut diamond, perfect for engagements and special occasions.',
    descriptionAr: 'خاتم ذهب عيار 18 مذهل يضم ماسة قص لامع، مثالي للخطوبات والمناسبات الخاصة.',
    price: 4500,
    originalPrice: 5200,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'
    ],
    category: 'rings',
    metal: 'gold',
    stone: 'diamond',
    weight: 4.5,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    sizes: ['6', '7', '8', '9', '10'],
    inStock: true,
    rating: 4.9,
    reviews: 128
  },
  {
    id: '2',
    name: 'Sapphire Elegance Ring',
    nameAr: 'خاتم الياقط الأنيق',
    description: 'An exquisite platinum ring with a stunning blue sapphire center stone surrounded by diamonds.',
    descriptionAr: 'خاتم بلاتين رائع بحجر ياقوت أزرق مركزي محاط بالماس.',
    price: 8900,
    images: [
      'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    category: 'rings',
    metal: 'platinum',
    stone: 'sapphire',
    weight: 6.2,
    isFeatured: true,
    sizes: ['5', '6', '7', '8', '9'],
    inStock: true,
    rating: 4.8,
    reviews: 85
  },
  {
    id: '3',
    name: 'Pearl Drop Necklace',
    nameAr: 'قلادة اللؤلؤ المتدلي',
    description: 'Elegant white gold necklace featuring natural South Sea pearls in a timeless design.',
    descriptionAr: 'قلادة ذهب أبيض أنيقة تتميز بلآلئ بحر الجنوب الطبيعية بتصميم خالد.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800'
    ],
    category: 'necklaces',
    metal: 'gold',
    stone: 'pearl',
    weight: 12.5,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    name: 'Diamond Tennis Bracelet',
    nameAr: 'سوار التنس بالماس',
    description: 'A classic tennis bracelet featuring 3 carats of brilliant-cut diamonds set in 18k white gold.',
    descriptionAr: 'سوار تنس كلاسيكي يضم 3 قيراط من الماس اللامع في ذهب أبيض عيار 18.',
    price: 12500,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800'
    ],
    category: 'bracelets',
    metal: 'gold',
    stone: 'diamond',
    weight: 18.0,
    isFeatured: true,
    inStock: true,
    rating: 5.0,
    reviews: 42
  },
  {
    id: '5',
    name: 'Rose Gold Hoop Earrings',
    nameAr: 'أقراط حلقية ذهب وردي',
    description: 'Modern hoop earrings crafted in 14k rose gold with a polished finish.',
    descriptionAr: 'أقراط حلقية عصرية مصنوعة من ذهب وردي عيار 14 بتشطيب مصقول.',
    price: 890,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'
    ],
    category: 'earrings',
    metal: 'rose-gold',
    stone: 'none',
    weight: 5.5,
    isNew: true,
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '6',
    name: 'Emerald Statement Ring',
    nameAr: 'خاتم الزمرد الفاخر',
    description: 'A magnificent emerald ring set in yellow gold with diamond accents.',
    descriptionAr: 'خاتم زمرد رائع في ذهب أصفر مع لمسات من الماس.',
    price: 6750,
    images: [
      'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    category: 'rings',
    metal: 'gold',
    stone: 'emerald',
    weight: 7.8,
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '7',
    name: 'Ruby Pendant Necklace',
    nameAr: 'قلادة الياقوت الأحمر',
    description: 'A stunning ruby pendant on an 18k gold chain, perfect for elegant occasions.',
    descriptionAr: 'قلادة ياقوت أحمر مذهلة على سلسلة ذهب عيار 18، مثالية للمناسبات الراقية.',
    price: 5400,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    ],
    category: 'necklaces',
    metal: 'gold',
    stone: 'ruby',
    weight: 8.3,
    isNew: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.8,
    reviews: 94
  },
  {
    id: '8',
    name: 'Silver Charm Bracelet',
    nameAr: 'سوار الفضة بالتعاليق',
    description: 'A delicate sterling silver bracelet with removable charm accents.',
    descriptionAr: 'سوار فضة استرليني رقيق مع تعاليق قابلة للإزالة.',
    price: 650,
    originalPrice: 780,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800'
    ],
    category: 'bracelets',
    metal: 'silver',
    stone: 'none',
    weight: 9.2,
    inStock: true,
    rating: 4.5,
    reviews: 203
  },
  {
    id: '9',
    name: 'Diamond Stud Earrings',
    nameAr: 'أقراط الماس الثابتة',
    description: 'Classic diamond stud earrings in 14k white gold, perfect for everyday elegance.',
    descriptionAr: 'أقراط ماس ثابتة كلاسيكية في ذهب أبيض عيار 14، مثالية للأناقة اليومية.',
    price: 2100,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'
    ],
    category: 'earrings',
    metal: 'gold',
    stone: 'diamond',
    weight: 2.8,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviews: 178
  },
  {
    id: '10',
    name: 'Platinum Wedding Band',
    nameAr: 'خاتم زواج بلاتين',
    description: 'A timeless platinum wedding band with a comfort-fit interior.',
    descriptionAr: 'خاتم زواج بلاتين خالد مع بطانة داخلية مريحة.',
    price: 1850,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'
    ],
    category: 'rings',
    metal: 'platinum',
    stone: 'none',
    weight: 8.5,
    inStock: true,
    sizes: ['6', '7', '8', '9', '10', '11'],
    rating: 4.7,
    reviews: 312
  },
  {
    id: '11',
    name: 'Layered Gold Chains',
    nameAr: 'سلاسل ذهب متعددة الطبقات',
    description: 'A trendy layered necklace set featuring three distinct gold chains.',
    descriptionAr: 'مجموعة قلادات طبقية عصرية تضم ثلاث سلاسل ذهب مميزة.',
    price: 1680,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800'
    ],
    category: 'necklaces',
    metal: 'gold',
    stone: 'none',
    weight: 15.0,
    isNew: true,
    inStock: true,
    rating: 4.6,
    reviews: 76
  },
  {
    id: '12',
    name: 'Sapphire Drop Earrings',
    nameAr: 'أقراط الياقوت المتدلية',
    description: 'Elegant drop earrings featuring blue sapphires and diamond accents in white gold.',
    descriptionAr: 'أقراط متدلية أنيقة تتميز بالياقوت الأزرق ولمسات الماس في ذهب أبيض.',
    price: 3400,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'
    ],
    category: 'earrings',
    metal: 'gold',
    stone: 'sapphire',
    weight: 4.2,
    isFeatured: true,
    inStock: true,
    rating: 4.8,
    reviews: 54
  }
];

export const categories = [
  { id: 'rings', name: 'Rings', nameAr: 'خواتم', icon: '💍' },
  { id: 'necklaces', name: 'Necklaces', nameAr: 'قلادات', icon: '📿' },
  { id: 'bracelets', name: 'Bracelets', nameAr: 'أساور', icon: '⌚' },
  { id: 'earrings', name: 'Earrings', nameAr: 'أقراط', icon: '✨' }
];

export const metals = [
  { id: 'gold', name: 'Gold', nameAr: 'ذهب' },
  { id: 'silver', name: 'Silver', nameAr: 'فضة' },
  { id: 'platinum', name: 'Platinum', nameAr: 'بلاتين' },
  { id: 'rose-gold', name: 'Rose Gold', nameAr: 'ذهب وردي' }
];

export const stones = [
  { id: 'diamond', name: 'Diamond', nameAr: 'ماس' },
  { id: 'ruby', name: 'Ruby', nameAr: 'ياقوت أحمر' },
  { id: 'emerald', name: 'Emerald', nameAr: 'زمرد' },
  { id: 'sapphire', name: 'Sapphire', nameAr: 'ياقوت أزرق' },
  { id: 'pearl', name: 'Pearl', nameAr: 'لؤلؤ' },
  { id: 'none', name: 'No Stone', nameAr: 'بدون حجر' }
];

export const testimonials = [
  {
    id: '1',
    name: 'سارة أحمد',
    content: 'تجربة رائعة! المجوهرات ذات جودة استثنائية والخدمة ممتازة. سعيد جداً بخاتم الخطوبة.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    id: '2',
    name: 'محمد العلي',
    content: 'أفضل مكان لشراء المجوهرات الفاخرة. الأسعار مناسبة والجودة لا تضاهى.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    id: '3',
    name: 'نورة الخالد',
    content: 'صممت لنفسي قلادة خاصة وكانت النتيجة أجمل مما تخيلت. شكراً لكم!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  }
];

export const instagramPosts = [
  { id: '1', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', likes: 2340 },
  { id: '2', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', likes: 1856 },
  { id: '3', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', likes: 3120 },
  { id: '4', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', likes: 2456 },
  { id: '5', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', likes: 1987 },
  { id: '6', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400', likes: 2654 }
];
