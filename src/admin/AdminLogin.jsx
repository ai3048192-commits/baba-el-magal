import { useState } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Flame, Lock } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { inputCls } from "./ui";

export default function AdminLogin() {
  const { login, isAdmin, db } = useStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  if (isAdmin) return <Navigate to={from} replace />;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) navigate(from, { replace: true });
    else setError("كلمة المرور غير صحيحة");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-base flex items-center justify-center p-4 relative isolate overflow-hidden">
      <div className="aurora -z-10" />
      <div className="absolute inset-0 bg-grid -z-10" />
      <form onSubmit={submit} className="gradient-border relative w-full max-w-sm glass rounded-[2rem] p-8 space-y-6 shadow-2xl animate-scale-in">
        <div className="text-center space-y-3">
          <span className="inline-flex bg-gradient-to-br from-brand to-brand-dark text-white p-4 rounded-3xl shadow-xl shadow-brand/40 animate-float">
            <Flame size={28} />
          </span>
          <h1 className="text-xl font-black text-ink">{db.settings.storeName}</h1>
          <p className="text-xs text-muted">تسجيل الدخول للوحة التحكم</p>
        </div>
        <div className="relative">
          <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="كلمة المرور"
            className={`${inputCls} pr-9 py-3`}
          />
        </div>
        {error && <p className="text-xs text-brand font-bold text-center">{error}</p>}
        <button type="submit" className="btn-shine w-full bg-gradient-to-l from-brand to-brand-dark text-white font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-brand/30 hover:shadow-brand/50 transition cursor-pointer">
          دخول
        </button>
        <Link to="/" className="block text-center text-[11px] text-faint hover:text-ink">العودة للموقع</Link>
      </form>
    </div>
  );
}
