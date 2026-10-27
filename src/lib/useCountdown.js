import { useEffect, useState } from "react";

// عداد تنازلي حقيقي لتاريخ انتهاء العرض (لو التاريخ فاضي → نهاية اليوم)
const resolveTarget = (endAt) => {
  if (endAt) {
    const t = new Date(endAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.getTime();
};

const split = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0,
  };
};

export default function useCountdown(endAt) {
  const [left, setLeft] = useState(() => split(resolveTarget(endAt) - Date.now()));

  useEffect(() => {
    const target = resolveTarget(endAt);
    const tick = () => setLeft(split(target - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endAt]);

  return left;
}
