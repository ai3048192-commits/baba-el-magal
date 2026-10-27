import { useEffect, useRef, useState } from "react";

// مراقب واحد مشترك لكل العناصر اللي بتظهر مع التمرير (أخف من مراقب لكل عنصر)
let observer = null;
const callbacks = new WeakMap();

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        callbacks.get(e.target)?.();
        observer.unobserve(e.target);
        callbacks.delete(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

// بيرجع ref + هل العنصر ظهر في الشاشة
export function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) {
      setVisible(true);
      return;
    }
    callbacks.set(el, () => setVisible(true));
    io.observe(el);
    return () => {
      io.unobserve(el);
      callbacks.delete(el);
    };
  }, []);
  return [ref, visible];
}

// هل الصفحة اتعملها تمرير لتحت؟ (للهيدر وزرار الرجوع لفوق)
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

// عداد بيعد من 0 لحد الرقم لما يظهر في الشاشة
export function useCountUp(target, visible, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, visible, duration]);
  return value;
}
