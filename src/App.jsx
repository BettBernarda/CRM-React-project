import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultTemplate from "./pages/DefaultTemplate";
import ProductsPage from "./pages/ProductsPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultTemplate />,
      children: [
        {
          path: "/produtos",
          element: <ProductsPage />
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  );
}