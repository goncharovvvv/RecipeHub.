import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

export default function ApiPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  async function load() {
    try {
      setStatus("loading");
      const response = await fetch("https://dummyjson.com/recipes?limit=30");
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      setItems(data.recipes || []); setStatus("success");
    } catch { setStatus("error"); }
  }
  useEffect(() => { load(); }, []);
  const filtered = items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  return <section className="section api-page">
    <span className="eyebrow">ВНЕШНИЙ ИСТОЧНИК ДАННЫХ</span><h1>Каталог рецептов API</h1>
    <p className="lead">Данные загружаются напрямую из публичного DummyJSON REST API.</p>
    <div className="api-info"><b>GET</b><code>https://dummyjson.com/recipes?limit=30</code><span>DevTools → Network → recipes</span></div>
    <input className="search-input api-search" placeholder="Поиск по рецептам..." value={query} onChange={e => setQuery(e.target.value)} />
    {status === "loading" && <div className="state-box">Загрузка данных API…</div>}
    {status === "error" && <div className="state-box error">Не удалось загрузить API. Проверь интернет-соединение. <button className="btn btn-small" onClick={load}>Повторить</button></div>}
    {status === "success" && filtered.length === 0 && <div className="state-box">По запросу ничего не найдено.</div>}
    {status === "success" && <div className="recipe-grid">{filtered.map(item => <RecipeCard key={item.id} recipe={item}/>)}</div>}
  </section>;
}