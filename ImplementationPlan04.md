# 🔧 ImplementationPlan04 — خطة الإصلاحات الشاملة

## 📋 ملخص المشاكل

| # | المشكلة | الحالة | الأولوية |
|---|---------|--------|----------|
| 0 | **Build Error** — ملف `account/page.tsx` مقطوع عند السطر 464 | 🔴 حرج | فوري |
| 1 | ألوان الذهب (أبيض/أصفر/وردي) غير موجودة في نموذج المنتج بلوحة التحكم | 🟡 متوسط | 2 |
| 2 | الصور المرفوعة من لوحة التحكم لا تظهر في صفحات المتجر | 🟡 متوسط | 3 |
| 3 | تغيير اللغة يعمل فقط في الصفحة الرئيسية ولا يشمل Navbar | 🟡 متوسط | 4 |
| 4 | إضافة المنتج للسلة لا تعمل | 🔴 حرج | 1 |
| 5 | المفضلة لا تحفظ ولا تعرض المنتجات | 🔴 حرج | 1 |

---

## 🔴 المشكلة 0: Build Error — ملف account/page.tsx مقطوع

### التشخيص
الملف ينتهي عند السطر 464 ببايتات فارغة (null bytes):
```
463:     <Suspense fallback={...}>
464:       <AccountContent \0\0\0\0\0\0\0\0\0\0...   ← ملف تالف!
```

يجب إغلاق الـ JSX بشكل صحيح:

### الإصلاح
**الملف:** `src/app/account/page.tsx` — **السطر 461-464**

```tsx
// الحالي (تالف):
export default function AccountPage() {
  return (
    <Suspense fallback={...}>
      <AccountContent \0\0\0\0

// الصحيح:
export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" /></div>}>
      <AccountContent />
    </Suspense>
  );
}
```

---

## 🔴 المشكلة 4: إضافة المنتج للسلة لا تعمل

### التشخيص
الكود في `product/[id]/page.tsx` (سطر 106-146) يعمل بشكل صحيح تقنياً:
```typescript
const handleAddToCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) { /* يظهر رسالة "سجل دخول أولاً" */ return; }
  
  const res = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ product_id: parseInt(productId), quantity }),
  });
```

**السبب المحتمل 1:** `productId` يأتي كنص `"1"` لكن منتجات API تبدأ من رقم مختلف (مثلاً 15). إذا أضفنا منتج API بـ `id=15` والمستخدم يحاول إضافة منتج ثابت بـ `id="1"` → 404 من الخادم.

**السبب المحتمل 2:** المستخدم غير مسجل دخول → الرسالة تظهر لكن لا يلاحظها.

**السبب المحتمل 3:** زر "أضف للسلة" في `ProductCard.tsx` (سطر 132-141) ليس له `onClick` handler! إنه فقط زر عرض:
```tsx
<button className="..." >
  {t('أضف للسلة', 'Add to Cart')}
</button>  // ← لا يوجد onClick!
```

### الإصلاح المطلوب

#### 1. إضافة onClick لزر السلة في ProductCard
**الملف:** `src/components/ProductCard.tsx`

```tsx
// إضافة handler
const handleQuickAdd = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // توجيه لصفحة تسجيل الدخول
    window.location.href = '/login';
    return;
  }
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ product_id: parseInt(product.id), quantity: 1 }),
    });
    if (res.ok) {
      // تحديث localStorage + إرسال event
      const cart = localStorage.getItem('cart');
      const items = cart ? JSON.parse(cart) : [];
      const existing = items.find((i: any) => String(i.product_id) === product.id);
      if (existing) { existing.quantity += 1; } else { items.push({ product_id: parseInt(product.id), quantity: 1 }); }
      localStorage.setItem('cart', JSON.stringify(items));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
};

// ربطه بالزر
<button onClick={handleQuickAdd} className="...">
```

#### 2. التأكد من product_id في product/[id]/page.tsx
إذا المنتج قادم من API فإن `productId` هو رقم صحيح. لكن يجب التأكد:
```tsx
body: JSON.stringify({
  product_id: parseInt(product.id),  // ← استخدام product.id بدل productId من URL
  quantity: quantity,
}),
```

---

## 🔴 المشكلة 5: المفضلة لا تعرض المنتجات

### التشخيص
**السبب 1:** زر المفضلة في `ProductCard.tsx` (سطر 82) يغيّر `isFavorite` محلياً فقط ولا يحفظ في `localStorage`:
```tsx
<button onClick={() => setIsFavorite(!isFavorite)}>  // ← تغيير مؤقت فقط!
```

**السبب 2:** صفحة Account تقرأ المفضلة من `localStorage.getItem('favorites')` لكن **لا أحد يكتب إليها!**

### الإصلاح المطلوب

#### 1. تحديث ProductCard ليحفظ المفضلة
**الملف:** `src/components/ProductCard.tsx`

```tsx
// قراءة الحالة الأولية من localStorage
const [isFavorite, setIsFavorite] = useState(() => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('favorites');
  if (!saved) return false;
  try { return JSON.parse(saved).includes(product.id); } catch { return false; }
});

// handler محدّث
const toggleFavorite = () => {
  const saved = localStorage.getItem('favorites');
  let favs: string[] = saved ? JSON.parse(saved) : [];
  if (favs.includes(product.id)) {
    favs = favs.filter(id => id !== product.id);
  } else {
    favs.push(product.id);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  setIsFavorite(!isFavorite);
  window.dispatchEvent(new Event('storage'));  // إخطار الصفحات الأخرى
};
```

#### 2. تحديث Account page لعرض المنتجات المفضلة
**الملف:** `src/app/account/page.tsx`

المنتجات المفضلة يجب أن تُفلتر من `allProducts` (التي تُجلب من API):
```tsx
const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));
```
ثم عرضها بـ `ProductCard` بدلاً من نص ثابت.

---

## 🟡 المشكلة 1: ألوان الذهب غير موجودة في نموذج المنتج

### التشخيص
نموذج إضافة المنتج في الأدمن (سطر 411-415) يحتوي فقط على حقل "المادة":
```tsx
<option value="Gold">ذهب</option>
<option value="Silver">فضة</option>
<option value="Platinum">بلاتين</option>
<option value="Rose Gold">ذهب وردي</option>
```

لكن في الـ Navbar يوجد تصنيف "اللون" مع:
- ذهب أبيض (White Gold)
- ذهب أصفر (Yellow Gold)  
- ذهب وردي (Rose Gold)

### الإصلاح المطلوب

#### إضافة حقل "اللون" لنموذج المنتج
**الملف:** `src/app/admin/page.tsx`

1. تحديث `emptyProduct` ليشمل `color`:
```tsx
const emptyProduct = { ..., color: 'Yellow', ... };
```

2. إضافة `<select>` جديد في النموذج:
```tsx
<div>
  <label className="block text-sm font-medium mb-1">اللون</label>
  <select value={productForm.color} onChange={...}>
    <option value="Yellow">ذهب أصفر</option>
    <option value="White">ذهب أبيض</option>
    <option value="Rose">ذهب وردي</option>
  </select>
</div>
```

3. **في الباك إند:** يحتاج إضافة حقل `color` لموديل `Product`:
```python
# models.py → class Product
color = Column(String(50), nullable=True)
```

> ⚠️ **ملاحظة:** هذا يتطلب migration بسيط للقاعدة. بديل مؤقت: استخدام حقل `material` ليشمل اللون (مثلاً `White Gold` بدل `Gold`).

---

## 🟡 المشكلة 2: الصور المرفوعة لا تظهر في المتجر

### التشخيص
الرفع يعمل بشكل صحيح (الملف يُحفظ في `static/product_images/`). لكن:

1. **مسار الصورة في API:** يرجع `/static/product_images/abc.jpg`
2. **دالة `resolveImageUrl` في `lib/api.ts`** (سطر 5-10) تحوّله لـ:
   ```
   http://127.0.0.1:8000/static/product_images/abc.jpg
   ```
3. **المشكلة:** الباك إند يجب أن يخدم الملفات الثابتة (Static Files). تأكد من أن `main.py` يحتوي:
   ```python
   app.mount("/static", StaticFiles(directory="static"), name="static")
   ```

### الإصلاح
**الملف:** `jewelry-backend/main.py`

التأكد من وجود mount للملفات الثابتة (يجب أن يكون موجوداً بالفعل).

**الملف:** `jewelry-store/src/lib/api.ts` — التأكد أن `resolveImageUrl` تعمل:
```typescript
export function resolveImageUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace('/api', '');  // → http://127.0.0.1:8000
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
```

**الإصلاح في ProductCard وصفحات العرض:**
التأكد من أن الصور تمرر عبر `resolveImageUrl` قبل عرضها.

---

## 🟡 المشكلة 3: الترجمة تعمل فقط في الصفحة الرئيسية

### التشخيص
كما تم توثيقه في `ImplementationPlan03.md`:
- الـ Navbar يحتوي ~200 نص عربي محفور في بيانات Mega Menu
- الصفحات الداخلية لا تستخدم `useLanguage()` 
- مفاتيح الترجمة في `LanguageContext.tsx` ناقصة (login.*, account.*, etc.)

### الإصلاح (مرجع: ImplementationPlan03.md)
1. إضافة المفاتيح الناقصة للقاموس (`login.username`, `login.password`, `login.title`, etc.)
2. تحويل الـ Navbar Mega Menu لبنية ثنائية اللغة
3. تطبيق `t()` في باقي الصفحات

> ⚠️ هذا إصلاح كبير (~125 دقيقة). يمكن تأجيله للمرحلة التالية والتركيز على المشاكل الحرجة أولاً.

---

## 📋 ترتيب التنفيذ

| # | المهمة | الملفات | الوقت |
|---|--------|---------|-------|
| 1 | إصلاح Build Error (account/page.tsx) | account/page.tsx | 2 دقيقة |
| 2 | إصلاح المفضلة (ProductCard + Account) | ProductCard.tsx, account/page.tsx | 15 دقيقة |
| 3 | إصلاح زر السلة في ProductCard | ProductCard.tsx | 10 دقائق |
| 4 | إضافة ألوان الذهب في Admin form | admin/page.tsx | 5 دقائق |
| 5 | فحص عرض الصور (Static files) | main.py, api.ts | 5 دقائق |
| 6 | إضافة مفاتيح الترجمة الناقصة | LanguageContext.tsx | 10 دقائق |
| **الإجمالي** | | | **~47 دقيقة** |

---

## 🧪 خطة التحقق

1. ✅ `npm run build` يعمل بدون أخطاء
2. ✅ إضافة منتج للمفضلة → ظهوره في `/account?tab=favorites`
3. ✅ إضافة منتج للسلة من ProductCard + من صفحة المنتج
4. ✅ رفع صورة من Admin → ظهورها في `/shop` و `/product/[id]`
5. ✅ إضافة منتج بلون "ذهب أبيض" من Admin
