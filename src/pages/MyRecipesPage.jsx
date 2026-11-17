import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";

const KEY = "recipehub-recipes";
export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  function refresh() {
    try { setRecipes((JSON.parse(localStorage.getItem(KEY)) || []).filter(r => r.ownerId === user.id)); }
    catch { setRecipes([]); }
  }
  useEffect(() => { refresh(); }, [user.id]);
  function remove(id) {
    if (!confirm("Удалить этот рецепт?")) return;
    const all = JSON.parse(localStorage.getItem(KEY) || "[]").filter(r => r.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all)); refresh();
  }
  return <section className="section">
    <div className="section-heading"><div><span className="eyebrow">ЛИЧНАЯ КОЛЛЕКЦИЯ</span><h1>Мои рецепты</h1><p className="muted">Здесь хранятся рецепты, которые добавили вы.</p></div><Link className="btn" to="/recipe/new">＋ Новый рецепт</Link></div>
    {recipes.length === 0 ? <div className="empty-panel"><span>✳</span><h2>Пока здесь пусто</h2><p>Добавь первый собственный рецепт в свою коллекцию.</p><Link className="btn" to="/recipe/new">Добавить рецепт</Link></div>
      : <div className="recipe-grid">{recipes.map(r => <div key={r.id}><RecipeCard recipe={r} mine onDelete={remove}/><Link className="edit-link" to={`/recipe/edit/${r.id}`}>✎ Редактировать</Link></div>)}</div>}
  </section>;
}