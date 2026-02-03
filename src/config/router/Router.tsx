import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { MainLayout } from "@/components/layouts";
import ProductCatalog from "@/modules/products/pages/catalog/productCatalog";
import UserCatalog from "@/modules/users/pages/catalog/userCatalog";

const routes = [
    {
        path: Routes.Home,
        element: (
            <MainLayout />
        ),
        children: [
            {
                path: Routes.Products,
                element: <ProductCatalog />,
            },
            {
                path: Routes.Users,
                element: <UserCatalog />,
            },
        ],
    },
    {
        path: "*",
        element: <>Página no encontrada</>,
    },
];

const router = createBrowserRouter(routes);

export { router };
