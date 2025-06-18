import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultTemplate from "./pages/DefaultTemplate";
import ProductsPage from "./pages/ProductsPage";
import ChartsPage from "./pages/ChartsPage"

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultTemplate />,
      children: [
        {
          path: "/produtos",
          element: <ProductsPage />
        },
        {
          path: "/",
          element: <ChartsPage/>
        }

      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  );
}