import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, ShoppingCart, Package, Users, AlertTriangle, ArrowLeft, Table2, BarChart3, Truck, HandCoins, CalendarClock } from "lucide-react";
import { offersOn } from "../lib/offers";
import { useStore } from "../store/StoreContext";
import { formatNumber, formatPrice, formatDateTime, ORDER_STATUSES } from "../lib/format";
import { Card, PageTitle, StatusBadge } from "./ui";
import { Reveal } from "../components/ui";

function StatTile({ icon: I, label, value, sub, to, i = 0 }) {
  const body = (
    <Reveal i={i} className="h-full">
      <div className="group relative h-full overflow-hidden bg-card border border-ink/10 hover:border-brand/40 rounded-[1.75rem] p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
        <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/20 transition" />
        <div className="relative flex items-center justify-between mb-5">
          <span className="text-xs font-bold text-muted">{label}</span>
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center shadow-lg shadow-brand/25 group-hover:rotate-[-8deg] transition-transform duration-500">
            <I size={18} />
          </span>
        </div>
        <div className="relative text-2xl font-black text-ink tabular-nums tracking-tight">{value}</div>
        {sub && <div className="relative text-[11px] text-faint mt-1.5">{sub}</div>}
      </div>
    </Reveal>
  );
  return to ? <Link to={to} className="block h-full">{body}</Link> : body;
}

// مبيعات آخر 7 أيام — سلسلة واحدة، أعمدة بلون المتجر، تلميح عند المرور، وعرض كجدول
function SalesChart({ orders }) {
  const [asTable, setAsTable] = useState(false);
  const [hover, setHover] = useState(null);

  const days = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayOrders = orders.filter((o) => o.status !== "cancelled" && new Date(o.createdAt).toDateString() === key);
      list.push({
        label: d.toLocaleDateString("ar-EG", { weekday: "short" }),
        date: d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }),
        total: dayOrders.reduce((s, o) => s + o.total, 0),
        count: dayOrders.length,
      });
    }
    return list;
  }, [orders]);

  const max = Math.max(...days.map((d) => d.total), 1);

  return (
    <Card
      title="المبيعات — آخر 7 أيام"
      action={
        <button onClick={() => setAsTable(!asTable)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted hover:text-ink cursor-pointer">
          {asTable ? <BarChart3 size={14} /> : <Table2 size={14} />} {asTable ? "عرض كرسم" : "عرض كجدول"}
        </button>
      }
    >
      {asTable ? (
        <table className="w-full text-xs">
          <thead className="text-faint">
            <tr><th className="text-right py-2 font-bold">اليوم</th><th className="text-right font-bold">الطلبات</th><th className="text-left font-bold">المبيعات</th></tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {days.map((d) => (
              <tr key={d.date}><td className="py-2 text-ink-3">{d.label} {d.date}</td><td className="text-ink-3">{d.count}</td><td className="text-left text-ink font-bold">{formatPrice(d.total)}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative" role="img" aria-label={`مبيعات آخر 7 أيام، الإجمالي ${formatPrice(days.reduce((s, d) => s + d.total, 0))}`}>
          <div className="h-48 flex items-end gap-2 sm:gap-4 border-b border-ink/10">
            {days.map((d, i) => (
              <div
                key={d.date}
                className="relative flex-1 h-full flex items-end justify-center cursor-default"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className={`w-full max-w-[28px] rounded-t-[4px] transition-opacity ${hover === null || hover === i ? "opacity-100" : "opacity-40"}`}
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: d.total ? 4 : 0, background: "rgb(var(--brand))" }}
                />
                {hover === i && (
                  <div className="absolute bottom-full mb-2 z-10 whitespace-nowrap bg-deep border border-ink/15 rounded-lg px-3 py-2 text-[11px] shadow-xl">
                    <div className="text-muted">{d.label} {d.date}</div>
                    <div className="text-ink font-bold">{formatPrice(d.total)}</div>
                    <div className="text-faint">{d.count} طلب</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 sm:gap-4 mt-2">
            {days.map((d) => (
              <span key={d.date} className="flex-1 text-center text-[10px] text-faint">{d.label}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const { db } = useStore();
  const { orders, products } = db;
  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const active = products.filter((p) => p.active);
  const lowStock = active.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const customers = new Set(orders.map((o) => o.customer?.phone)).size;
  const inTransit = orders.filter((o) => ["shipped", "out_for_delivery"].includes(o.status)).length;
  const pendingDeposits = orders.filter((o) => o.deposit?.amount > 0 && !o.deposit.paid && !["cancelled", "returned"].includes(o.status));
  const todayOffers = offersOn(db.offers);

  const topProducts = useMemo(() => {
    const map = {};
    valid.forEach((o) =>
      o.items.forEach((i) => {
        map[i.productId] = map[i.productId] || { name: i.name, image: i.image, qty: 0, total: 0 };
        map[i.productId].qty += i.qty;
        map[i.productId].total += i.qty * i.price;
      }),
    );
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [valid]);

  return (
    <div className="space-y-6">
      <PageTitle title="نظرة عامة" subtitle={`أهلاً بيك في لوحة تحكم ${db.settings.storeNameAr}`} />

      <Link to="/admin/offers" className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-brand/30 bg-brand/5 hover:bg-brand/10 transition">
        <CalendarClock size={18} className="text-brand" />
        <span className="text-xs font-black text-ink">عروض النهارده:</span>
        {todayOffers.length ? (
          todayOffers.map((o) => (
            <span key={o.id} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-card border border-ink/10 text-ink-2">
              {o.title}{o.discountPercent > 0 && ` -${o.discountPercent}%`}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-muted">مفيش عروض شغالة — اعمل عرض جديد</span>
        )}
        <ArrowLeft size={14} className="mr-auto text-muted" />
      </Link>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatTile i={0} icon={Wallet} label="إجمالي المبيعات" value={formatPrice(revenue)} sub={`متوسط الطلب ${formatPrice(valid.length ? revenue / valid.length : 0)}`} />
        <StatTile i={1} icon={ShoppingCart} label="الطلبات" value={formatNumber(orders.length)} sub={`${newOrders} طلب جديد محتاج مراجعة`} to="/admin/orders" />
        <StatTile i={2} icon={Package} label="المنتجات النشطة" value={formatNumber(active.length)} sub={`${lowStock.length} منتج مخزونه قليل`} to="/admin/products" />
        <StatTile i={3} icon={Users} label="العملاء" value={formatNumber(customers)} sub={`${db.subscribers.length} مشترك في النشرة`} to="/admin/customers" />
        <StatTile i={4} icon={Truck} label="شحنات في الطريق" value={formatNumber(inTransit)} sub="تم الشحن + خرج للتوصيل" to="/admin/shipping" />
        <StatTile i={5} icon={HandCoins} label="عربون منتظر" value={formatPrice(pendingDeposits.reduce((s, o) => s + o.deposit.amount, 0))} sub={`${pendingDeposits.length} طلب محتاج تأكيد`} to="/admin/shipping" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><SalesChart orders={orders} /></div>
        <Card title="الأكثر مبيعاً">
          {topProducts.length ? (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.name} className="flex items-center gap-3">
                  <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <span className="flex-1 text-xs text-ink-3 line-clamp-1">{p.name}</span>
                  <span className="text-xs font-bold text-ink">{p.qty} قطعة</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-faint text-center py-8">لسه مفيش مبيعات.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card
          title="أحدث الطلبات"
          className="xl:col-span-2"
          action={<Link to="/admin/orders" className="text-[11px] font-bold text-brand flex items-center gap-1">الكل <ArrowLeft size={12} /></Link>}
        >
          {orders.length ? (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs min-w-[520px]">
                <thead className="text-faint">
                  <tr className="border-b border-ink/10">
                    <th className="text-right px-5 pb-3 font-bold">الطلب</th>
                    <th className="text-right pb-3 font-bold">العميل</th>
                    <th className="text-right pb-3 font-bold">الحالة</th>
                    <th className="text-left px-5 pb-3 font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.id}>
                      <td className="px-5 py-3">
                        <div className="font-mono font-bold text-ink">{o.number}</div>
                        <div className="text-[10px] text-faint">{formatDateTime(o.createdAt)}</div>
                      </td>
                      <td className="text-ink-3">{o.customer.name}</td>
                      <td><StatusBadge status={o.status} list={ORDER_STATUSES.map((s) => ({ ...s, label: s.short }))} /></td>
                      <td className="text-left px-5 font-bold text-ink">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-faint text-center py-8">لسه مفيش طلبات. الطلبات اللي العملاء بيعملوها من الموقع هتظهر هنا.</p>
          )}
        </Card>

        <Card title="تنبيهات المخزون">
          {lowStock.length ? (
            <ul className="space-y-2">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 text-xs">
                  <AlertTriangle size={14} className={p.stock === 0 ? "text-brand" : "text-amber-400"} />
                  <span className="flex-1 text-ink-3 line-clamp-1">{p.name}</span>
                  <span className={`font-bold ${p.stock === 0 ? "text-brand" : "text-amber-400"}`}>{p.stock === 0 ? "نفد" : `${p.stock} قطع`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-faint text-center py-8">المخزون كله تمام 👌</p>
          )}
        </Card>
      </div>
    </div>
  );
}
