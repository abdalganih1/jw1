import Image from 'next/image';
import Link from 'next/link';
import { products, testimonials, instagramPosts, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
            alt="Luxury jewelry hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          <div className="max-w-2xl ml-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-fadeIn">
              <span className="text-gradient-gold">LUXE</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light">مجوهرات فاخرة</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 animate-fadeIn stagger-1">
              اكتشف مجموعتنا الحصرية من أرقى المجوهرات المصممة بعناية فائقة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end animate-fadeIn stagger-2">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a962] text-white font-medium hover:bg-[#b8944f] transition-all duration-300 rounded-lg luxury-shadow"
              >
                تسوّق الآن
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/builder" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 rounded-lg"
              >
                صمّم قطعتك
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {categories.map((category, index) => (
              <Link 
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <Image
                  src={products.find(p => p.category === category.id)?.images[0] || ''}
                  alt={category.nameAr}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-right">
                  <span className="text-2xl lg:text-3xl mb-2 block">{category.icon}</span>
                  <h3 className="text-lg lg:text-xl font-semibold text-white">{category.nameAr}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              الأكثر مبيعاً
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              القطع الأكثر طلباً من مجموعتنا الفاخرة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/shop?sort=popular"
              className="inline-flex items-center gap-2 text-[#c9a962] font-medium hover:underline"
            >
              عرض الكل
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"
                alt="Custom jewelry design"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            <div className="text-right">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                صمّم قطعتك الخاصة
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                هل لديك تصور خاص لمجوهرات أحلامك؟ فريقنا من المصممين المحترفين جاهز لتحويل أفكارك إلى واقع. اختر المعدن، الحجر الكريم، والتصميم الذي يناسب ذوقك.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 justify-end">
                  <span className="text-gray-300">استشارة مجانية مع مصمم خبير</span>
                  <span className="w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center text-sm">✓</span>
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span className="text-gray-300">معاينة ثلاثية الأبعاد للتصميم</span>
                  <span className="w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center text-sm">✓</span>
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span className="text-gray-300">ضمان سنة على جميع القطع</span>
                  <span className="w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center text-sm">✓</span>
                </li>
              </ul>
              <Link 
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a962] text-white font-medium hover:bg-[#b8944f] transition-all duration-300 rounded-lg"
              >
                ابدأ التصميم
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              مجموعات جديدة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              أحدث إضافاتنا من المجوهرات الفاخرة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-6">
                قصتنا
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                منذ أكثر من عقدين من الزمن، نلتزم في LUXE بتقديم أرقى المجوهرات الفاخرة لعملائنا الكرام. كل قطعة في مجموعتنا تروي قصة من الإتقان والجمال.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                نؤمن بأن المجوهرات ليست مجرد زينة، بل هي تعبير عن الذات وذكريات ثمينة تدوم مدى الحياة.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 text-[#c9a962] font-medium hover:underline"
              >
                اقرأ المزيد
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="relative aspect-square max-w-lg mx-auto lg:mx-0 order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"
                alt="Our story"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              آراء عملائنا
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تجارب حقيقية من عملائنا الكرام
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-[#faf9f7] p-6 lg:p-8 rounded-lg text-right">
                <div className="flex gap-1 mb-4 justify-end">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#c9a962] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                  </div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              تابعنا على انستغرام
            </h2>
            <p className="text-[#c9a962]">@luxejewelry.ksa</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {instagramPosts.map((post) => (
              <a 
                key={post.id}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square group overflow-hidden"
              >
                <Image
                  src={post.image}
                  alt="Instagram post"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-white text-sm mr-2">{post.likes.toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#c9a962] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4">
            اشترك في نشرتنا البريدية
          </h2>
          <p className="text-white/80 mb-6">
            كن أول من يعلم عن العروض الحصرية والمجموعات الجديدة
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              dir="ltr"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#1a1a1a] text-white rounded-lg font-medium hover:bg-[#2d2d2d] transition-colors"
            >
              اشترك الآن
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
