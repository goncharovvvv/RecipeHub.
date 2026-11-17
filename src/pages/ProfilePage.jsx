import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProfilePage() {
  const { user } = useAuth();
  const recipes = JSON.parse(localStorage.getItem("recipehub-recipes") || "[]").filter(r => r.ownerId === user.id);
  const favorites = JSON.parse(localStorage.getItem("recipehub-favorites") || "[]");
  return <section className="profile-page"><span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span><h1>Привет, {user.name}!</h1><p className="muted">Твоё небольшое кулинарное пространство.</p><div className="profile-card"><div className="profile-avatar">{user.name[0]?.toUpperCase()}</div><div><h2>{user.name}</h2><p>{user.email}</p><span className="role-tag">Роль: {user.role}</span></div></div><div className="stats-grid"><div><b>{recipes.length}</b><span>Мои рецепты</span></div><div><b>{favorites.length}</b><span>В избранном</span></div><div><b>1</b><span>Тип аккаунта</span></div></div><Link className="btn" to="/my-recipes">Перейти к моим рецептам ↗</Link></section>;
}