import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultTemplate from "./pages/DefaultTemplate";
import ProductsPage from "./pages/ProductsPage";
import ChartsPage from "./pages/ChartsPage"
import axios from "axios";
import ProductPage from "./pages/ProductPage";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  axios.defaults.baseURL = 'http://localhost:3000'

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultTemplate />,
      children: [
        {
          path: "/",
          element: <ChartsPage/>
        },
        {
          path: "/produtos",
          element: <ProductsPage />
        },
        {
          path: '/produtos/:id',
          element: <ProductPage />
        },
        {
          path: '*',
          element: <PageNotFound />
        }
      ]
    },
  ])

  return (
    <RouterProvider router={router}/>
  );
}