import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./pages/DefaultLayout";
import ProductsPage from "./pages/ProductsPage";
import ChartsPage from "./pages/ChartsPage"
import axios from "axios";
import ProductPage from "./pages/ProductPage";
import PageNotFound from "./pages/PageNotFound";
import ProductCategoriesPage from "./pages/ProductCategoriesPage";
import ProductCategoryPage from "./pages/ProductCategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SalesPage from "./pages/SalesPage";
import SalePage from "./pages/SalePage";
import ClientsPage from "./pages/ClientsPage";

export default function App() {
  axios.defaults.baseURL = 'http://localhost:3000'

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/",
          element: <ChartsPage />
        },
        {
          path: "/login",
          element: <LoginPage />
        },
        {
          path: "/signup",
          element: <SignupPage />
        },
        {
          path: "/produtos",
          element: <ProductsPage />
        },
        {
          path: "/produtos/categorias",
          element: <ProductCategoriesPage />
        },
        {
          path: "/produtos/categorias/:id",
          element: <ProductCategoryPage />
        },
        {
          path: "/produtos/:id",
          element: <ProductPage />
        },
        {
          path: "/vendas",
          element: <SalesPage />
        },
        {
          path: "/vendas/:id",
          element: <SalePage />
        },
        {
          path: "/clientes",
          element: <ClientsPage />
        },
        {
          path: "*",
          element: <PageNotFound />
        }
      ]
    },
  ])

  return (
    <RouterProvider router={router} />
  );
}