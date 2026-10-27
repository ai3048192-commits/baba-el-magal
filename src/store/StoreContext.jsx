import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultDb, DB_VERSION } from "../data";
import { nextId } from "../lib/format";
import { applyOffers } from "../lib/offers";
import { getConfig, getSession, pullPublicData, remoteInsert, remotePlaceOrder, remoteUpdateOrder } from "../lib/supabase";

// المخزن الرئيسي للموقع: قاعدة البيانات + السلة + المفضلة + الإشعارات + دخول الأدمن
// البيانات بتتحفظ في localStorage، ولو Supabase متفعّل الطلبات بتتبعت له كمان (راجع docs/دليل_المشروع.md)

const DB_KEY = "bem_db";
const CART_KEY = "bem_cart";
const WISHLIST_KEY = "bem_wishlist";
const THEME_KEY = "theme";
const ADMIN_KEY = "bem_admin";
const PENDING_KEY = "bem_pending_push"; // الأدمن عدّل حاجة ولسه ما رفعهاش لـ Supabase

const StoreContext = createContext(null);

const clone = (v) => JSON.parse(JSON.stringify(v));

const read = (storage, key, fallback) => {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// دمج البيانات المحفوظة مع الافتراضية: أي جدول أو إعداد جديد بيتضاف من غير ما تضيع تعديلات الأدمن
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const deepMerge = (base, saved) => {
  if (!isObj(base) || !isObj(saved)) return saved === undefined ? base : saved;
  const out = { ...base };
  Object.keys(saved).forEach((k) => (out[k] = deepMerge(base[k], saved[k])));
  return out;
};

const migrate = (saved) => {
  const d = clone(defaultDb);
  const db = { ...d, ...saved, settings: deepMerge(d.settings, saved.settings || {}), version: DB_VERSION };
  if ((saved.version || 1) < 2) {
    // v2: صفقات الجمعة بقت جدول عروض بدل قسم "friday" في المنتج
    db.products = db.products.map((p) => ({ ...p, sections: (p.sections || []).filter((x) => x !== "friday") }));
    db.orders = db.orders.map((o) => ({ history: [{ status: o.status, at: o.createdAt }], deposit: { amount: 0, paid: false }, trackingNumber: "", ...o }));
  }
  return db;
};

const loadDb = () => {
  const saved = read(localStorage, DB_KEY, null);
  return saved && typeof saved === "object" ? migrate(saved) : clone(defaultDb);
};

export function StoreProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [cart, setCart] = useState(() => read(localStorage, CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => read(localStorage, WISHLIST_KEY, []));
  const [toast, setToast] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === "dark";
      const mode = db.settings.theme?.defaultMode || "dark";
      return mode === "system" ? window.matchMedia?.("(prefers-color-scheme: dark)").matches : mode === "dark";
    } catch {
      return true;
    }
  });
  // تاريخ النهارده (بيتحدث كل دقيقة عشان العروض اليومية تتغير بعد نص الليل)
  const [day, setDay] = useState(() => new Date().toDateString());
  useEffect(() => {
    const t = setInterval(() => setDay(new Date().toDateString()), 60000);
    return () => clearInterval(t);
  }, []);
  const [isAdmin, setIsAdmin] = useState(() => read(sessionStorage, ADMIN_KEY, false));
  const [pendingPush, setPendingPush] = useState(() => read(localStorage, PENDING_KEY, false));
  const isAdminRef = useRef(isAdmin);
  isAdminRef.current = isAdmin;

  // كل تعديل على قاعدة البيانات بيعدي من هنا عشان القيمة الراجعة تكون محدثة فوراً
  const dbRef = useRef(db);
  const commit = useCallback((updater) => {
    const next = updater(dbRef.current);
    dbRef.current = next;
    setDb(next);
    return next;
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!write(localStorage, DB_KEY, db)) {
      showToast("مساحة التخزين ممتلئة — استخدم روابط صور بدل رفع الصور", "error");
    }
  }, [db, showToast]);

  useEffect(() => void write(localStorage, CART_KEY, cart), [cart]);
  useEffect(() => void write(localStorage, WISHLIST_KEY, wishlist), [wishlist]);
  useEffect(() => void write(sessionStorage, ADMIN_KEY, isAdmin), [isAdmin]);
  useEffect(() => void write(localStorage, PENDING_KEY, pendingPush), [pendingPush]);

  // عند فتح الموقع: لو Supabase مربوط نحمّل المنتجات والإعدادات والعروض منه (عشان كل الزوار يشوفوا نفس البيانات)
  // ما بنحمّلش لو الأدمن عنده تعديلات لسه ما اترفعتش، عشان ما تضيعش
  useEffect(() => {
    const cfg = getConfig(dbRef.current.settings);
    if (!cfg || read(localStorage, PENDING_KEY, false)) return;
    pullPublicData(cfg)
      .then((remote) =>
        commit((prev) => ({
          ...prev,
          ...remote,
          settings: remote.settings
            ? { ...prev.settings, ...remote.settings, integrations: prev.settings.integrations, adminPassword: prev.settings.adminPassword }
            : prev.settings,
          // مفاتيح API الشحن بتفضل من الجهاز (مش بتتقري للعامة)
          shippingCompanies: remote.shippingCompanies
            ? remote.shippingCompanies.map((c) => ({ ...c, api: prev.shippingCompanies.find((x) => x.id === c.id)?.api || c.api }))
            : prev.shippingCompanies,
        })),
      )
      .catch(() => {
        /* مفيش اتصال — الموقع بيكمل بالبيانات المحفوظة */
      });
  }, [commit]);

  // أي تعديل من الأدمن بيتعلّم إنه محتاج يترفع
  const markDirty = useCallback(() => {
    if (isAdminRef.current) setPendingPush(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  // ===== عمليات قاعدة البيانات (CRUD) =====
  const saveItem = useCallback(
    (collection, item) => {
      let saved = item;
      commit((prev) => {
        const list = prev[collection];
        const exists = item.id != null && list.some((x) => x.id === item.id);
        saved = exists ? item : { ...item, id: nextId(list) };
        return {
          ...prev,
          [collection]: exists ? list.map((x) => (x.id === item.id ? saved : x)) : [...list, saved],
        };
      });
      markDirty();
      return saved;
    },
    [commit, markDirty],
  );

  const removeItem = useCallback(
    (collection, id) => {
      markDirty();
      return commit((prev) => ({ ...prev, [collection]: prev[collection].filter((x) => x.id !== id) }));
    },
    [commit, markDirty],
  );

  const setCollection = useCallback(
    (collection, value) => {
      markDirty();
      return commit((prev) => ({ ...prev, [collection]: value }));
    },
    [commit, markDirty],
  );

  const updateSettings = useCallback(
    (patch) => {
      markDirty();
      return commit((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    },
    [commit, markDirty],
  );

  const resetDb = useCallback(() => commit(() => clone(defaultDb)), [commit]);

  const importDb = useCallback(
    (data) => {
      if (!data || typeof data !== "object" || !Array.isArray(data.products)) return false;
      commit(() => migrate(data));
      return true;
    },
    [commit],
  );

  // ===== السلة =====
  const addToCart = useCallback(
    (product, qty = 1, color = "") => {
      const key = `${product.id}-${color}`;
      setCart((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { key, productId: product.id, qty, color }];
      });
      showToast("تمت إضافة المنتج للسلة 🛒");
    },
    [showToast],
  );

  const updateCartQty = useCallback((key, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((i) => i.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // المنتجات بأسعار النهارده (بعد تطبيق جدول العروض) — الموقع بيقرا منها، والأدمن بيعدل db.products
  const products = useMemo(
    () => applyOffers(db.products, db.offers, new Date()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db.products, db.offers, day],
  );

  // عناصر السلة مع بيانات المنتج (المنتجات المحذوفة بتختفي)
  const cartItems = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
        .filter((i) => i.product),
    [cart, products],
  );

  // ===== المفضلة =====
  const toggleWishlist = useCallback(
    (product) => {
      const liked = wishlist.includes(product.id);
      setWishlist((prev) => (liked ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
      showToast(liked ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة ❤️");
    },
    [wishlist, showToast],
  );

  // ===== الطلبات =====
  const placeOrder = useCallback(
    (order) => {
      let created = null;
      commit((prev) => {
        const id = nextId(prev.orders);
        const now = new Date().toISOString();
        created = {
          trackingNumber: "",
          shippingCompanyId: prev.settings.defaultShippingCompanyId || null,
          ...order,
          id,
          number: `BEM-${Date.now().toString().slice(-6)}${id}`,
          status: "new",
          createdAt: now,
          history: [{ status: "new", note: "", at: now }],
        };
        // خصم الكميات المباعة من المخزون
        const products = prev.products.map((p) => {
          const sold = order.items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0);
          return sold ? { ...p, stock: Math.max(0, (p.stock || 0) - sold) } : p;
        });
        return { ...prev, products, orders: [created, ...prev.orders] };
      });
      // لو Supabase متفعّل: الطلب بيتسجل في قاعدة البيانات كمان (عشان يوصل للأدمن من أي جهاز)
      const cfg = getConfig(dbRef.current.settings);
      if (cfg) {
        remotePlaceOrder(cfg, created).catch(() =>
          showToast("الطلب اتسجل، بس فيه مشكلة في الاتصال بقاعدة البيانات", "error"),
        );
      }
      return created;
    },
    [commit, showToast],
  );

  // تحديث طلب من الأدمن: أي تغيير في الحالة أو ملاحظة بيتسجل في سجل التتبع
  const updateOrder = useCallback(
    (order, patch = {}, note = "") => {
      const statusChanged = patch.status && patch.status !== order.status;
      const event = statusChanged || note ? { status: patch.status || order.status, note, at: new Date().toISOString() } : null;
      const next = { ...order, ...patch, history: event ? [...(order.history || []), event] : order.history || [] };
      commit((prev) => ({ ...prev, orders: prev.orders.map((o) => (o.id === order.id ? next : o)) }));
      const cfg = getConfig(dbRef.current.settings);
      const session = getSession();
      if (order.remote && cfg && session) {
        remoteUpdateOrder(cfg, session.token, next, event).catch((e) => showToast(`لم يتم التحديث في Supabase: ${e.message}`, "error"));
      }
      return next;
    },
    [commit, showToast],
  );

  // دمج الطلبات اللي جاية من Supabase مع المحلية (بالرقم)
  const mergeRemoteOrders = useCallback(
    (remote) =>
      commit((prev) => {
        const numbers = new Set(remote.map((o) => o.number));
        return { ...prev, orders: [...remote, ...prev.orders.filter((o) => !numbers.has(o.number))] };
      }),
    [commit],
  );

  const addReview = useCallback(
    (review) => {
      saveItem("reviews", { ...review, date: new Date().toISOString(), approved: true });
      const cfg = getConfig(dbRef.current.settings);
      if (cfg) {
        remoteInsert(cfg, "reviews", { product_id: review.productId, name: review.name, city: review.city, comment: review.comment, rating: review.rating }).catch(() => {});
      }
      showToast("شكراً! تم نشر تقييمك");
    },
    [saveItem, showToast],
  );

  const subscribe = useCallback(
    (email) => {
      const cfg = getConfig(dbRef.current.settings);
      if (cfg) remoteInsert(cfg, "subscribers", { email }).catch(() => {});
      commit((prev) => {
        if (prev.subscribers.some((s) => s.email === email)) return prev;
        return {
          ...prev,
          subscribers: [
            ...prev.subscribers,
            { id: nextId(prev.subscribers), email, createdAt: new Date().toISOString() },
          ],
        };
      });
    },
    [commit],
  );

  // ===== الأدمن =====
  const login = useCallback(
    (password) => {
      const ok = password === db.settings.adminPassword;
      setIsAdmin(ok);
      return ok;
    },
    [db.settings.adminPassword],
  );
  const logout = useCallback(() => setIsAdmin(false), []);

  const value = {
    db,
    products,
    saveItem,
    removeItem,
    setCollection,
    updateSettings,
    resetDb,
    importDb,
    cart,
    cartItems,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    placeOrder,
    updateOrder,
    mergeRemoteOrders,
    addReview,
    subscribe,
    toast,
    showToast,
    isDark,
    setIsDark,
    isAdmin,
    pendingPush,
    markPushed: () => setPendingPush(false),
    login,
    logout,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
