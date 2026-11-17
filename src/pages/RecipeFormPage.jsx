import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const KEY = "recipehub-recipes";
const empty = { name: "", image: "", category: "Домашнее", cookTimeMinutes: 30, servings: 2, ingredientsText: "", instructionsText: "" };
export default function RecipeFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!editing) return;
    const recipe = (JSON.parse(localStorage.getItem(KEY) || "[]")).find(r => String(r.id) === id && r.ownerId === user.id);
    if (!recipe) { setError("Рецепт не найден или у вас нет доступа."); return; }
    setForm({ name: recipe.name, image: recipe.image, category: recipe.category, cookTimeMinutes: recipe.cookTimeMinutes, servings: recipe.servings, ingredientsText: recipe.ingredients.join("\n"), instructionsText: recipe.instructions.join("\n") });
  }, [id, editing, user.id]);
  function change(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.ingredientsText.trim() || !form.instructionsText.trim()) { setError("Заполни название, ингредиенты и приготовление."); return; }
    const all = JSON.parse(localStorage.getItem(KEY) || "[]");
    const data = { name: form.name.trim(), image: form.image.trim() || "https://images.unsplash.com/photo-1547592180-85f173990554?w=700", category: form.category, cookTimeMinutes: Number(form.cookTimeMinutes), servings: Number(form.servings), ingredients: form.ingredientsText.split("\n").map(x => x.trim()).filter(Boolean), instructions: form.instructionsText.split("\n").map(x => x.trim()).filter(Boolean), ownerId: user.id, rating: "—" };
    if (editing) {
      const index = all.findIndex(r => String(r.id) === id && r.ownerId === user.id);
      if (index < 0) { setError("Не удалось найти рецепт."); return; }
      all[index] = { ...all[index], ...data };
    } else all.unshift({ id: Date.now(), ...data });
    localStorage.setItem(KEY, JSON.stringify(all));
    navigate("/my-recipes");
  }
  return <section className="form-page"><Link to="/my-recipes" className="back-link">← Мои рецепты</Link><span className="eyebrow">ВАША КУЛИНАРНАЯ КОЛЛЕКЦИЯ</span><h1>{editing ? "Редактировать рецепт" : "Новый рецепт"}</h1><p className="muted">Заполни простую форму — рецепт появится в твоём личном кабинете.</p>
    <form className="recipe-form" onSubmit={submit}>
      <label>Название блюда<input name="name" value={form.name} onChange={change} placeholder="Например, паста с грибами" required /></label>
      <label>Ссылка на изображение<input name="image" value={form.image} onChange={change} placeholder="https://..." /></label>
      <div className="form-row"><label>Категория<input name="category" value={form.category} onChange={change} /></label><label>Время (мин)<input type="number" min="1" name="cookTimeMinutes" value={form.cookTimeMinutes} onChange={change}/></label><label>Порции<input type="number" min="1" name="servings" value={form.servings} onChange={change}/></label></div>
      <label>Ингредиенты <small>(каждый с новой строки)</small><textarea name="ingredientsText" rows="5" value={form.ingredientsText} onChange={change} placeholder={"200 г пасты\n150 г грибов\nСоль и перец"} required /></label>
      <label>Приготовление <small>(каждый шаг с новой строки)</small><textarea name="instructionsText" rows="6" value={form.instructionsText} onChange={change} placeholder={"Отвари пасту.\nОбжарь грибы.\nСмешай и подавай."} required /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn" type="submit">{editing ? "Сохранить изменения" : "Опубликовать рецепт"} ↗</button>
    </form>
  </section>;
}