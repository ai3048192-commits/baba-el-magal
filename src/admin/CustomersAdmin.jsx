import { useMemo } from "react";
import { Trash2, Download } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatDate, formatPrice } from "../lib/format";
import { Button, Card, PageTitle } from "./ui";

const downloadCsv = (name, rows) => {
  const csv = "﻿" + rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

// العملاء (مستخرجين من الطلبات) + مشتركين النشرة البريدية
export default function CustomersAdmin() {
  const { db, removeItem } = useStore();

  const customers = useMemo(() => {
    const map = {};
    db.orders.forEach((o) => {
      const key = o.customer.phone;
      map[key] = map[key] || { ...o.customer, orders: 0, spent: 0, last: o.createdAt };
      map[key].orders += 1;
      if (o.status !== "cancelled") map[key].spent += o.total;
      if (o.createdAt > map[key].last) map[key].last = o.createdAt;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
  }, [db.orders]);

  return (
    <div className="space-y-4">
      <PageTitle title="العملاء والمشتركين" />

      <Card
        title={`العملاء (${customers.length})`}
        action={
          customers.length > 0 && (
            <Button variant="ghost" onClick={() => downloadCsv("customers.csv", [["الاسم", "الموبايل", "المحافظة", "عدد الطلبات", "إجمالي المشتريات"], ...customers.map((c) => [c.name, c.phone, c.governorate, c.orders, c.spent])])}>
              <Download size={14} /> تصدير CSV
            </Button>
          )
        }
      >
        {customers.length ? (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-xs min-w-[560px]">
              <thead className="text-faint">
                <tr className="border-b border-ink/10">
                  <th className="text-right px-5 pb-3 font-bold">العميل</th>
                  <th className="text-right pb-3 font-bold">المحافظة</th>
                  <th className="text-right pb-3 font-bold">الطلبات</th>
                  <th className="text-right pb-3 font-bold">إجمالي المشتريات</th>
                  <th className="text-right px-5 pb-3 font-bold">آخر طلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {customers.map((c) => (
                  <tr key={c.phone}>
                    <td className="px-5 py-3">
                      <div className="font-bold text-ink-1">{c.name}</div>
                      <a href={`tel:${c.phone}`} className="text-[10px] text-faint font-mono">{c.phone}</a>
                    </td>
                    <td className="text-muted">{c.governorate}</td>
                    <td className="text-ink-3">{c.orders}</td>
                    <td className="font-bold text-ink">{formatPrice(c.spent)}</td>
                    <td className="px-5 text-muted">{formatDate(c.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-xs text-faint py-8">العملاء بيظهروا هنا أول ما يعملوا طلبات.</p>
        )}
      </Card>

      <Card
        title={`مشتركين النشرة البريدية (${db.subscribers.length})`}
        action={
          db.subscribers.length > 0 && (
            <Button variant="ghost" onClick={() => downloadCsv("subscribers.csv", [["الإيميل", "تاريخ الاشتراك"], ...db.subscribers.map((s) => [s.email, s.createdAt])])}>
              <Download size={14} /> تصدير CSV
            </Button>
          )
        }
      >
        {db.subscribers.length ? (
          <ul className="divide-y divide-ink/5">
            {db.subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5 text-xs">
                <span className="text-ink-2 font-mono" dir="ltr">{s.email}</span>
                <span className="flex items-center gap-3 text-faint">
                  {formatDate(s.createdAt)}
                  <button onClick={() => removeItem("subscribers", s.id)} className="p-1.5 rounded-lg hover:text-brand hover:bg-brand/10 cursor-pointer" aria-label="حذف">
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xs text-faint py-8">لا يوجد مشتركين بعد (الاشتراك من الفوتر).</p>
        )}
      </Card>
    </div>
  );
}
