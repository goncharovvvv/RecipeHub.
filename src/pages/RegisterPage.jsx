import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./LoginPage";
export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" }); const [error, setError] = useState("");
  function submit(e) { e.preventDefault(); if (form.password.length < 6) { setError("Пароль должен содержать минимум 6 символов."); return; } const message = register(form.name, form.email, form.password); if (message) setError(message); else navigate("/profile"); }
  return <AuthForm title="Создай аккаунт" subtitle="Сохраняй любимые идеи и добавляй свои рецепты." onSubmit={submit} error={error} button="Зарегистрироваться">
    <label>Имя<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Твоё имя"/></label>
    <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
    <label>Пароль<input type="password" minLength="6" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Минимум 6 символов"/></label>
    <p className="form-foot">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
  </AuthForm>;
}