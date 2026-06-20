# DESIGN-QUALITY-REPORT — مطعم شهناي الهندي

## Design Read
Reading this as: **luxury restaurant brand site** for Jeddah diners + the owner, with a **rich royal Indian** language (maroon / saffron-gold / cream / emerald), leaning toward vanilla HTML+CSS+JS, El Messiri display + Tajawal body, restrained-but-bespoke motion. Dials: `VARIANCE 7 / MOTION 6 / DENSITY 3`.

## المهارات المُستدعاة وكيف طُبّقت
| المهارة | كيف استُخدمت |
|---|---|
| `ui-ux-pro-max` (+ `search.py … --design-system`) | شغّلت البحث على «indian restaurant rich spice elegant». أكّد اتجاه **أحمر شهي + ذهب دافئ** وعائلة خطوط مطاعم. تبنّيت الـ palette الدلالية، سلّم المسافات 4/8، تأكيد SVG-not-emoji، تباين ≥4.5:1، prefers-reduced-motion. اخترت El Messiri/Tajawal (من الدوسيير) بدل Playfair لأن المحتوى عربي RTL. |
| `design-taste-frontend` | Design tokens في `:root`، منع AI-tells: لا بنفسجي، ظلال مائلة للعنف ممنوعة (الظلال مصبوغة بلون البراند)، قفل اللون والشكل (radius موحّد)، هيرو يلتزم بالـ viewport، CTA لا يلتف، الـ logo wall/eyebrow restraint، نص محايد ومراجَع. |
| `emil-design-eng` | منحنيات easing مخصّصة (`cubic-bezier(.23,1,.32,1)`)، `scale(.97)` عند الضغط، sheen على CTA، transforms/opacity فقط، الماندالا ترتسم ثم تهدأ، durations 150–420ms، stagger لروابط القائمة، احترام reduced-motion. |
| `high-end-visual-design` | إحساس وكالة: hero سينمائي بطبقات (ماندالا/بهارات/دخان/ken-burns)، كروت بإطار (media-in-shell)، أزرار pill مع ico-circ متحرّك (button-in-button)، مساحات واسعة `py-24`، badge عائم على صورة القصة، FABs دائرية. |

## مخرجات الـ design-system (ui-ux-pro-max)
- **Pattern:** Feature-Rich Showcase (hero → trust → dishes grid → story → gallery → form → location → CTA).
- **اللون:** Appetizing red + warm gold → ترجمتها لـ «royal Indian»: maroon `#5A1320/#3D0C16`، saffron `#E9A93A/#F2C25C`، cream `#FBF4E6`، emerald accent `#1C6B52`.
- **الخط:** عائلة مطاعم culinary → El Messiri (display) + Tajawal (body) للعربية.
- **Effects:** أقسام كبيرة 48px+، hover bold، type كبير، 200–300ms.

## قرارات UI/UX الأساسية + سبب الألوان/الخطوط
- **maroon أساس + saffron إكسنت واحد مقفول** عبر كل الصفحة (emerald للـ kicker/نص ثانوي فقط — لون دلالي لا تزييني). يعكس فخامة الضيافة الهندية والبهارات.
- **El Messiri** يعطي عناوين عربية أنيقة بروح ثقافية؛ **Tajawal** نظيف للجسم ومقروء ≥16px.
- **قليل الصور، تخطيط ممتلئ:** 5 صور فقط، فعّلتها بكروت أطباق بدون صور حقيقية تستخدم «spice-card» (خلفية ماروني متدرّجة + glyph زعفراني SVG) لملء القائمة دون صور مزيّفة، + hero يستعمل صورة الكاري كطبقة ken-burns + gallery يعيد توزيع الأربع صور بأحجام متباينة.

## الموشن التوقيعي (موثّق)
**هيرو الزعفران/البهارات** — ≤3 مجموعات متحرّكة:
1. **Mandala** SVG inline (دوائر متراكزة + بتلات على حلقتين). ترتسم عبر `stroke-dasharray/dashoffset` (`@keyframes draw` 2.6s ease-out)، ثم تدور ببطء `spin 90s linear`.
2. **Spice particles** — تُبنى بالـ JS (22 ذرّة، 10 عند reduced-motion)، تطفو للأعلى `float-up` بوهج `box-shadow` زعفراني، drift/delay/مدة عشوائية.
3. **Incense smoke** — wisp شفاف `blur(8px)` يتمايل + **Ken Burns** على صورة `sh-3.jpg` بـ `mix-blend luminosity`.
- **60fps:** transform/opacity فقط (+ stroke-dashoffset للرسم).
- **Fallback كامل (`prefers-reduced-motion: reduce`):** الماندالا تظهر مرسومة بالكامل (`stroke-dashoffset:0`)، الذرّات ثابتة موزّعة، لا دوران/طفو/دخان/ken-burns. الصفحة تبقى مكتملة بصريًا.
- **بوليش إضافي:** scroll-reveal (IntersectionObserver + safety 1.4s)، hover-zoom على كروت/جاليري، sticky nav shrink، CTA sheen.

## تطبيق Hooked / UX
- Trigger → Action واضح: «احجز طاولة» متكرّر (nav/hero/final)، نية CTA واحدة لكل غرض.
- Reward: Toast نجاح + فتح واتساب فوري برسالة معبّأة.
- Investment: localStorage يحفظ الحجوزات التجريبية.

## تطبيق iOS HIG / لمس
- أهداف لمس ≥48px، تباعد ≥8px، ردّ ضغط `scale(.97)` <160ms، `min-h-dvh` لا `100vh`، safe-area عبر FABs بعيدة عن الحواف، قائمة الجوال overlay ملء الشاشة 100vw/100dvh بخلفية صلبة معتمة + X واضح.

## تطبيق Accessibility (≥WCAG AA)
- `<html lang="ar" dir="rtl">`، سيمانتيك header/nav/main/section/footer، تدرّج عناوين h1→h3.
- تباين: كريم على ماروني داكن، ماروني داكن على كريم — كلها ≥4.5:1.
- كل `<img>` لها alt عربي + width/height + lazy (غير الهيرو) + decoding async.
- كل زر أيقونة له `aria-label`؛ `:focus-visible` بحدود emerald/saffron 3px؛ القائمة `role=dialog aria-modal`؛ Toast `aria-live=polite`؛ أخطاء النموذج `aria-live` تحت كل حقل؛ Escape يغلق القائمة/اللايتبوكس.
- اللون ليس وسيلة المعنى الوحيدة (أيقونات + نص دائمًا).

## تطبيق Impeccable / Taste (اختبار القبول)
- فاخر؟ نعم — طبقات هيرو سينمائية، إطارات كروت، ذهب على ماروني. مناسب للنشاط؟ نعم — هوية هندية صريحة بلا كليشيه. يقنع خلال 3 ثوانٍ؟ العنوان + التقييم + CTA فوق الطية. لا يشبه قالبًا مجانيًا؟ موشن ماندالا/بهارات بصمة خاصة. تناسق المسافات/الأزرار/الحركة؟ سلّم 4/8 وeasing موحّد.

## نتيجة الفحص الذاتي
لا em-dash في أي نص ظاهر · ثيم واحد مقفول · إكسنت واحد · radius موحّد · تباين أزرار سليم · لا CTA يلتف · لا أسعار مخترعة (كلها «حسب القائمة») · نص محايد جندريًا (احجز/اطلب/تواصل) · صور حقيقية فقط · لا node_modules/package.json.
