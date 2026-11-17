import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

const API = "https://dummyjson.com/recipes?limit=30";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [categories, setCategories] = useState(["Все"]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRecipes() {
      try {
        setLoading(true); setError("");
        const response = await fetch(API, { signal: controller.signal });
        if (!response.ok) throw new Error("Не удалось получить рецепты. Попробуйте ещё раз.");
        const data = await response.json();
        setRecipes(data.recipes || []);
        const unique = [...new Set((data.recipes || []).flatMap(r => r.mealType || []))];
        setCategories(["Все", ...unique]);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Ошибка загрузки.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    loadRecipes();
    return () => controller.abort();
  }, []);

  const visible = useMemo(() => recipes.filter(r => {
    const matchesName = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Все" || (r.mealType || []).includes(category);
    return matchesName && matchesCategory;
  }), [recipes, search, category]);

  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">ВКУСНО • ПРОСТО • КАЖДЫЙ ДЕНЬ</span>
        <h1>Найди свой<br/><em>вкус жизни.</em></h1>
        <p>Коллекция идей для завтрака, обеда и ужина. Выбирай рецепт и готовь что-то особенное.</p>
        <a className="btn" href="#recipes">Смотреть рецепты <span>↘</span></a>
        <div className="hero-note"><span className="note-avatars">● ● ●</span><span>Идеи для вкусных моментов</span></div>
      </div>
      <div className="hero-art">
        <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000" alt="Аппетитное блюдо" />
        <div className="floating-tag">✦ Вдохновение<br/><b>на каждый день</b></div>
      </div>
    </section>

    <section className="section" id="recipes">
      <div className="section-heading"><div><span className="eyebrow">ЧТО ПРИГОТОВИТЬ?</span><h2>Популярные рецепты</h2></div><Link to="/api" className="under-link">Открыть API-каталог ↗</Link></div>
      <div className="filters">
        <input className="search-input" placeholder="⌕  Найти блюдо..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
      </div>
      {loading && <div className="state-box">Загружаем вкусные идеи…</div>}
      {error && <div className="state-box error">{error} <button className="btn btn-small" onClick={() => location.reload()}>Повторить</button></div>}
      {!loading && !error && visible.length === 0 && <div className="state-box">Ничего не найдено. Попробуй изменить поиск или категорию.</div>}
      {!loading && !error && <div className="recipe-grid">{visible.slice(0, 12).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>}
    </section>
    <section className="cta-band"><div><span className="eyebrow">ТВОЯ КУХНЯ — ТВОИ ПРАВИЛА</span><h2>Есть свой фирменный рецепт?</h2><p>Сохрани его в личной коллекции и возвращайся к нему в любой момент.</p></div><Link className="btn btn-light" to="/recipe/new">Добавить рецепт ↗</Link></section>
  </>;
}