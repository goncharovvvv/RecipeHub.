import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import MyRecipesPage from "./pages/MyRecipesPage";
import RecipeFormPage from "./pages/RecipeFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ApiPage from "./pages/ApiPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="recipe/:id" element={<RecipePage />} />
      <Route path="api" element={<ApiPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="my-recipes" element={<MyRecipesPage />} />
        <Route path="recipe/new" element={<RecipeFormPage />} />
        <Route path="recipe/edit/:id" element={<RecipeFormPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>;
}