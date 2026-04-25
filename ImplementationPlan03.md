# 🌍 خطة ترجمة المشروع — Vivelt Gold (AR ↔ EN)

## 📋 وصف المشكلة

عند تبديل اللغة للإنكليزية:
- ✅ الصفحة الرئيسية `/` → تترجم (تستخدم `useLanguage`)
- ✅ صفحة "من نحن" `/about` → تترجم
- ✅ صفحة "تواصل معنا" `/contact` → تترجم
- ✅ الـ Footer → يترجم
- ❌ **الـ Navbar** → يبقى عربي (بيانات Mega Menu محفورة)
- ❌ **لوحة التحكم** `/admin` → كلها عربي
- ❌ **صفحة المتجر** `/shop` → عربي
- ❌ **صفحة المنتج** `/product/[id]` → عربي
- ❌ **صفحة السلة** `/cart` → عربي
- ❌ **صفحة الدفع** `/checkout` → عربي
- ❌ **صفحة الحساب** `/account` → عربي
- ❌ **صفحة تسجيل الدخول** `/login` → عربي
- ❌ **صفحة التسجيل** `/register` → عربي
- ❌ **صفحة المصمم** `/builder` → عربي
- ❌ **التصنيفات والفلاتر** → عربي

---

## 🔍 تحليل السبب الجذري

### نظام الترجمة الحالي
المشروع يستخدم `LanguageContext` مع قاموس ترجمات في `LanguageContext.tsx`:
- **العربية:** ~83 مفتاح مترجم
- **الإنكليزية:** ~83 مفتاح مترجم
- **المفاتيح تغطي فقط:** Navbar (أسماء الأقسام فقط) + Hero + Shop labels + About + Contact + Footer

### المشكلة الأساسية: نصوص محفورة (Hardcoded)

**1. الـ Navbar (743 سطر) — الأكبر:**
الـ Mega Menu بيانات ضخمة (~200+ نص عربي) محفورة مباشرة:
```typescript
// سطر 23-266 — بيانات ثابتة بالعربي!
const navCategories = [
  { label: 'ألماس', megaMenu: { columns: [
    { title: 'الفئات', links: [
      { label: 'خواتم الماس', ... },
      { label: 'أساور الماس', ... },
    ]},
    { title: 'تسوّقي حسب السعر', links: [
      { label: 'أقل من $1,000', ... },
    ]},
  ]}},
  // ... 5 أقسام أخرى
];
```

**2. الصفحات الداخلية:**
كل الصفحات (shop, product, cart, checkout, login, register, admin, account, builder) لا تستخدم `useLanguage()` أبداً — كل النصوص محفورة بالعربي.

---

## ✅ خطة الإصلاح

### المرحلة 1: توسيع قاموس الترجمات (الأساس)

**الملف:** `src/contexts/LanguageContext.tsx`

إضافة مفاتيح جديدة لتغطية كل الصفحات:

| المجموعة | عدد المفاتيح المطلوبة تقريباً |
|----------|-------------------------------|
| Navbar Mega Menu | ~80 مفتاح |
| Shop page | ~15 مفتاح |
| Product page | ~20 مفتاح |
| Cart page | ~15 مفتاح |
| Checkout page | ~25 مفتاح |
| Login/Register | ~15 مفتاح |
| Account page | ~20 مفتاح |
| Builder page | ~25 مفتاح |
| Admin page | ~40 مفتاح |
| FilterSidebar | ~10 مفتاح |
| **الإجمالي** | **~265 مفتاح جديد** |

---

### المرحلة 2: ترجمة الـ Navbar (🔴 حرج — الأعلى تأثيراً)

**الملف:** `src/components/Navbar.tsx`

**التغيير:** تحويل `navCategories` من بيانات ثابتة إلى دالة تعتمد على اللغة:

```typescript
// قبل (ثابت)
const navCategories = [
  { label: 'ألماس', ... }
];

// بعد (ديناميكي)
function getNavCategories(t: (key: string) => string) {
  return [
    { label: t('nav.mega.diamonds'), ... }
  ];
}
```

**أو البديل الأبسط:** إضافة حقل `labelEn` لكل عنصر:
```typescript
const navCategories = [
  { label: 'ألماس', labelEn: 'Diamonds', ... }
];
// واستخدام: lang === 'en' ? cat.labelEn : cat.label
```

---

### المرحلة 3: ترجمة صفحة المتجر `/shop` (🟡 متوسط)

**الملفات:**
- `src/app/shop/page.tsx`
- `src/components/FilterSidebar.tsx`

**النصوص المحفورة:**
- "المتجر" → Shop
- "منتج" → Products
- "تصفية" → Filter
- "لم يتم العثور على منتجات" → No products found
- "جرب تغيير معايير التصفية" → Try changing filter criteria
- "مسح الفلاتر" → Clear Filters
- أسماء الفئات والمعادن والأحجار

---

### المرحلة 4: ترجمة صفحة المنتج `/product/[id]` (🟡 متوسط)

**الملف:** `src/app/product/[id]/page.tsx`

**النصوص المحفورة:**
- "المنتج غير موجود" → Product not found
- "العودة للمتجر" → Back to Shop
- "المقاس" → Size
- "المعدن" → Metal
- "الكمية" → Quantity
- "أضف للسلة" → Add to Cart
- "احجز استشارة مجانية" → Book Free Consultation
- "ضمان سنة كاملة" → 1 Year Warranty
- "شحن مجاني" → Free Shipping
- "إرجاع خلال 30 يوم" → 30-Day Returns
- "تفاصيل المنتج" → Product Details
- "منتجات مشابهة" → Related Products

---

### المرحلة 5: ترجمة صفحة السلة والدفع (🟡 متوسط)

**الملفات:**
- `src/app/cart/page.tsx` (~15 نص)
- `src/app/checkout/page.tsx` (~25 نص)

**أمثلة:**
- "سلة التسوق فارغة" → Your cart is empty
- "ملخص الطلب" → Order Summary
- "المجموع الفرعي" → Subtotal
- "الشحن" → Shipping
- "إتمام الشراء" → Checkout
- "معلومات الشحن" → Shipping Info
- "طريقة الدفع" → Payment Method
- "تأكيد الطلب" → Confirm Order

---

### المرحلة 6: ترجمة Login/Register (🟢 سريع)

**الملفات:**
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

**أمثلة:**
- "تسجيل الدخول" → Login
- "اسم المستخدم" → Username
- "كلمة المرور" → Password
- "دخول" → Sign In
- "إنشاء حساب جديد" → Create Account

---

### المرحلة 7: ترجمة صفحة الحساب (🟢 طفيف)

**الملف:** `src/app/account/page.tsx`

**أمثلة:**
- "طلباتي" → My Orders
- "تصميماتي" → My Designs
- "العناوين" → Addresses
- "المفضلة" → Favorites
- "الملف الشخصي" → Profile

---

### المرحلة 8: ترجمة لوحة التحكم `/admin` (🟢 اختياري)

**الملف:** `src/app/admin/page.tsx`

> ⚠️ **ملاحظة:** لوحة التحكم عادةً تبقى بلغة واحدة (العربية) لأنها للمدير فقط. الترجمة هنا اختيارية.

---

## 📋 ترتيب التنفيذ (حسب الأولوية)

| # | المرحلة | الملفات | الأولوية | الوقت المقدر |
|---|---------|---------|----------|-------------|
| 1 | توسيع القاموس | LanguageContext.tsx | 🔴 حرج | 30 دقيقة |
| 2 | Navbar + Mega Menu | Navbar.tsx | 🔴 حرج | 25 دقيقة |
| 3 | Shop + Filters | shop/page.tsx, FilterSidebar.tsx | 🟡 متوسط | 15 دقيقة |
| 4 | Product page | product/[id]/page.tsx | 🟡 متوسط | 15 دقيقة |
| 5 | Cart + Checkout | cart/page.tsx, checkout/page.tsx | 🟡 متوسط | 20 دقيقة |
| 6 | Login + Register | login/page.tsx, register/page.tsx | 🟢 سريع | 10 دقيقة |
| 7 | Account page | account/page.tsx | 🟢 طفيف | 10 دقيقة |
| 8 | Admin (اختياري) | admin/page.tsx | ⚪ اختياري | 25 دقيقة |
| **الإجمالي (بدون Admin)** | | | | **~125 دقيقة** |

---

## 🧪 خطة التحقق

1. تبديل اللغة لـ EN → التأكد من ترجمة كل نص مرئي
2. تبديل اللغة لـ AR → التأكد أن كل شيء يعود عربي
3. التأكد من اتجاه النص (RTL/LTR) يتغير مع اللغة
4. التأكد من عدم وجود مفاتيح ترجمة ظاهرة (مثل `nav.mega.diamonds` بدل النص)
5. اختبار الـ Mega Menu بالإنكليزية

---

## 💡 توصيات إضافية

1. **ProductCard:** يستخدم `useLanguage` بالفعل ✅ لكن يعرض `nameAr` فقط — يجب عرض `name` عند `lang === 'en'`
2. **أسماء المنتجات:** المنتجات من API تحتوي `name` (EN) و `name` فقط — قد نحتاج حقل `name_ar` في الباك إند
3. **الـ dir attribute:** التأكد من أن كل صفحة تضيف `dir={lang === 'en' ? 'ltr' : 'rtl'}` على العنصر الجذري
