import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { MainLayout } from "@/components/layouts";
import ProductCatalog from "@/modules/products/pages/catalog/productCatalog";
import UserCatalog from "@/modules/users/pages/catalog/userCatalog";
import CustomerCatalog from "@/modules/customers/pages/catalog/CustomerCatalog";
import RoleCatalog from "@/modules/roles/pages/catalog/RoleCatalog";
import SalesHistory from "@/modules/sales/pages/SalesHistory";
import POS from "@/modules/sales/pages/POS";

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
            {
                path: Routes.Customers,
                element: <CustomerCatalog />,
            },
            {
                path: Routes.Roles,
                element: <RoleCatalog />,
            },
            {
                path: Routes.Sales,
                element: <SalesHistory />,
            },
            {
                path: Routes.POS,
                element: <POS />,
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
