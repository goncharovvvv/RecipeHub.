import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function exit() { logout(); navigate("/"); }
  return <>
    <header className="topbar">
      <div className="nav-wrap">
        <Link className="brand" to="/"><span className="brand-mark">✳</span> Recipe<span>Hub</span></Link>
        <nav>
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/api">Каталог API</NavLink>
          {user && <NavLink to="/my-recipes">Мои рецепты</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? <><Link className="user-chip" to="/profile">☺ {user.name}</Link><button className="btn btn-small btn-outline" onClick={exit}>Выйти</button></>
            : <><Link className="login-link" to="/login">Войти</Link><Link className="btn btn-small" to="/register">Регистрация</Link></>}
        </div>
      </div>
    </header>
    <main className="page-shell"><Outlet /></main>
    <footer className="footer"><div className="footer-inner"><b>✳ RecipeHub</b><span>Готовь с удовольствием. Учебный проект на React.</span><span>© 2026</span></div></footer>
  </>;
}