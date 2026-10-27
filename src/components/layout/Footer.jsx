import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { Icon } from "../../lib/icons";
import { PAYMENT_METHODS } from "../../lib/format";
import { Reveal } from "../ui";
import { SocialIcon, SOCIAL_LABELS } from "../ui/SocialIcons";

const LINKS = [
  ["/shop", "المتجر"],
  ["/offers", "عروض اليوم"],
  ["/friday-offers", "عروض الجمعة"],
  ["/discounts", "الخصومات"],
  ["/track", "تتبع شحنتك"],
  ["/wishlist", "المفضلة"],
  ["/about", "من نحن"],
];

// فاصل كلاسيك: خط — نجمة — خط
const Ornament = () => (
  <div className="flex items-center justify-center gap-4 text-brand/70" aria-hidden="true">
    <span className="w-16 sm:w-24 h-px bg-ink/15" />
    <span className="text-xs">✦</span>
    <span className="w-16 sm:w-24 h-px bg-ink/15" />
  </div>
);

// الفوتر الكلاسيك — كل حاجة في النص، بسيط وفاتح (وبيتبع الوضع الغامق)
export default function Footer() {
  const { db, subscribe } = useStore();
  const { settings, storeFeatures } = db;
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const social = Object.entries(settings.social || {}).filter(([, url]) => url);
  const payments = Object.entries(PAYMENT_METHODS).filter(([k]) => settings.paymentMethods?.[k]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe(email.trim());
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <footer dir="rtl" className="mt-20 bg-deep border-t border-ink/10">
      {/* مميزات المتجر */}
      <div className="border-b border-ink/10">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
          {storeFeatures.map((f, i) => (
            <Reveal key={f.id} i={i} className={`flex flex-col items-center text-center gap-2 py-8 px-4 ${i % 2 === 0 ? "border-l" : ""} lg:border-l border-ink/10 last:border-l-0`}>
              <Icon name={f.icon} size={22} strokeWidth={1.5} className="text-brand" />
              <span className="text-[13px] font-black text-ink tracking-wide">{f.title}</span>
              <span className="text-[11px] text-muted">{f.text}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-10">
        {/* الهوية */}
        <Reveal className="space-y-4">
          <Link to="/" className="inline-flex flex-col items-center leading-none">
            {settings.logoImage ? (
              <img src={settings.logoImage} alt={settings.storeName} className="h-14 w-auto" />
            ) : (
              <>
                <span className="text-3xl sm:text-4xl font-black uppercase tracking-[0.3em] text-ink">{settings.storeName}</span>
                <span className="mt-3 text-[11px] font-bold tracking-[0.4em] text-brand">{settings.storeNameAr}</span>
              </>
            )}
          </Link>
          <p className="max-w-xl mx-auto text-sm text-muted leading-loose">{settings.tagline}</p>
        </Reveal>

        <Ornament />

        {/* الروابط */}
        <Reveal as="nav" className="space-y-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {LINKS.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="link-underline text-[13px] font-bold tracking-wider text-ink-2 hover:text-ink transition">{label}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.id}`} className="text-xs text-muted hover:text-brand transition">{c.name}</Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* النشرة */}
        {settings.layout?.showNewsletter !== false && (
          <Reveal className="max-w-md mx-auto space-y-4">
            <div>
              <h3 className="text-lg font-black text-ink tracking-wide">انضم لقائمتنا</h3>
              <p className="text-xs text-muted mt-1">العروض الحصرية والمنتجات الجديدة توصلك الأول.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex items-end gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-1 min-w-0 bg-transparent border-b border-ink/25 focus:border-brand py-2.5 text-sm text-ink text-center placeholder-faint outline-none transition"
              />
              <button type="submit" className="pb-2.5 text-sm font-black tracking-wider text-ink border-b-2 border-brand hover:text-brand transition cursor-pointer">
                {done ? "تم ✓" : "اشترك"}
              </button>
            </form>
          </Reveal>
        )}

        {/* التواصل + السوشيال */}
        <Reveal className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted">
            <a href={`tel:${settings.phone}`} className="hover:text-ink transition" dir="ltr">{settings.phone}</a>
            <span className="text-faint">·</span>
            <a href={`mailto:${settings.email}`} className="hover:text-ink transition">{settings.email}</a>
            <span className="text-faint">·</span>
            <span>{settings.address}</span>
          </div>
          {social.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              {social.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[name]}
                  className="w-10 h-10 rounded-full border border-ink/20 text-ink-2 flex items-center justify-center hover:bg-ink hover:text-white dark:hover:text-neutral-950 hover:border-ink transition-colors duration-300"
                >
                  <SocialIcon name={name} size={15} />
                </a>
              ))}
            </div>
          )}
        </Reveal>
      </div>

      {/* السطر الأخير */}
      <div className="border-t border-ink/10">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-faint">
          <span className="tracking-wide">© {new Date().getFullYear()} {settings.storeNameAr} — جميع الحقوق محفوظة</span>
          {payments.length > 0 && (
            <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {payments.map(([k, label], i) => (
                <span key={k} className="flex items-center gap-2">
                  {i > 0 && <span>·</span>}
                  {label}
                </span>
              ))}
            </span>
          )}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-1.5 font-bold tracking-wider text-ink-2 hover:text-brand transition cursor-pointer">
            للأعلى <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
