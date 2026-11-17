import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CUSTOM_KEY = "recipehub-recipes";
const readCustom = () => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; } catch { return []; } };

export default function RecipePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMine = id.startsWith("mine-");
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError("");
      try {
        if (isMine) {
          const found = readCustom().find(r => String(r.id) === id.replace("mine-", ""));
          if (!found) throw new Error("Рецепт не найден.");
          if (active) setRecipe(found);
        } else {
          const res = await fetch(`https://dummyjson.com/recipes/${id}`);
          if (!res.ok) throw new Error("Рецепт не найден.");
          const data = await res.json();
          if (active) setRecipe(data);
        }
      } catch (e) { if (active) setError(e.message); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [id, isMine]);

  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("recipehub-favorites") || "[]");
    setSaved(favs.includes(String(id)));
  }, [id]);

  function toggleFavorite() {
    const favs = JSON.parse(localStorage.getItem("recipehub-favorites") || "[]");
    const next = saved ? favs.filter(x => x !== String(id)) : [...favs, String(id)];
    localStorage.setItem("recipehub-favorites", JSON.stringify(next)); setSaved(!saved);
  }

  if (loading) return <div className="state-box">Загружаем рецепт…</div>;
  if (error) return <div className="state-box error">{error} <Link to="/">На главную</Link></div>;
  return <div className="detail-page">
    <Link to="/" className="back-link">← Назад к рецептам</Link>
    <div className="detail-hero"><img src={recipe.image} alt={recipe.name}/><div className="detail-intro"><span className="eyebrow">RECIPEHUB • РЕЦЕПТ</span><h1>{recipe.name}</h1><p>{recipe.cuisine || recipe.category || "Домашняя кухня"} · {recipe.difficulty || "Просто и вкусно"}</p><div className="detail-stats"><span>◷ {recipe.cookTimeMinutes || 25} мин</span><span>★ {recipe.rating || "5.0"}</span><span>♧ {recipe.servings || 2} порции</span></div>{user && <button className="btn btn-outline" onClick={toggleFavorite}>{saved ? "♥ В избранном" : "♡ В избранное"}</button>}{isMine && user?.id === recipe.ownerId && <Link className="btn btn-small" to={`/recipe/edit/${recipe.id}`}>Редактировать</Link>}</div></div>
    <div className="detail-columns"><section><h2>Ингредиенты</h2><ul className="ingredient-list">{(recipe.ingredients || []).map((item, i) => <li key={i}><span>✓</span>{item}</li>)}</ul></section><section><h2>Приготовление</h2><ol className="instruction-list">{(recipe.instructions || []).map((item, i) => <li key={i}><b>{String(i + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol></section></div>
  </div>;
}