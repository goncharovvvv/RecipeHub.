import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "recipehub-users";
const SESSION_KEY = "recipehub-session";

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read(USERS_KEY, []));
  const [user, setUser] = useState(() => read(SESSION_KEY, null));

  useEffect(() => localStorage.setItem(USERS_KEY, JSON.stringify(users)), [users]);
  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function register(name, email, password) {
    const normalized = email.trim().toLowerCase();
    if (users.some(item => item.email === normalized)) return "Аккаунт с такой почтой уже существует.";
    const newUser = { id: Date.now(), name: name.trim(), email: normalized, password, role: "user" };
    setUsers(prev => [...prev, newUser]);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: "user" });
    return "";
  }

  function login(email, password) {
    const found = users.find(item => item.email === email.trim().toLowerCase() && item.password === password);
    if (!found) return "Неверная почта или пароль.";
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role });
    return "";
  }

  function logout() { setUser(null); }

  return <AuthContext.Provider value={{ user, register, login, logout }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}