import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState("");
  function submit(e) { e.preventDefault(); const message = login(form.email, form.password); if (message) setError(message); else navigate(location.state?.from?.pathname || "/profile", { replace: true }); }
  return <AuthForm title="С возвращением!" subtitle="Войди, чтобы управлять своей коллекцией рецептов." onSubmit={submit} error={error} button="Войти">
    <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
    <label>Пароль<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••"/></label>
    <p className="form-foot">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
  </AuthForm>;
}
export function AuthForm({ title, subtitle, onSubmit, error, button, children }) {
  return <div className="auth-wrap"><div className="auth-card"><div className="auth-icon">✳</div><span className="eyebrow">RECIPEHUB</span><h1>{title}</h1><p>{subtitle}</p><form onSubmit={onSubmit}>{children}{error && <div className="form-error">{error}</div>}<button className="btn btn-full">{button} ↗</button></form></div></div>;
}