import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, mine = false, onDelete }) {
  return <article className="recipe-card">
    <Link to={`/recipe/${mine ? `mine-${recipe.id}` : recipe.id}`} className="card-image-wrap">
      <img src={recipe.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=700"} alt={recipe.name} />
      <span className="card-time">◷ {recipe.cookTimeMinutes || 25} мин</span>
    </Link>
    <div className="card-content">
      <div className="card-meta"><span>{recipe.mealType?.[0] || recipe.category || "Домашнее"}</span><span>★ {recipe.rating || "5.0"}</span></div>
      <Link to={`/recipe/${mine ? `mine-${recipe.id}` : recipe.id}`} className="card-title">{recipe.name}</Link>
      <p>{recipe.description || `${recipe.cuisine || "Вкусный"} рецепт на каждый день.`}</p>
      {mine && <button className="text-danger" onClick={() => onDelete(recipe.id)}>Удалить рецепт</button>}
    </div>
  </article>;
}