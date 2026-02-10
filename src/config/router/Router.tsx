import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { MainLayout } from "@/components/layouts";
import ProductCatalog from "@/modules/products/pages/catalog/productCatalog";
import UserCatalog from "@/modules/users/pages/catalog/userCatalog";
import CustomerCatalog from "@/modules/customers/pages/catalog/CustomerCatalog";
import RoleCatalog from "@/modules/roles/pages/catalog/RoleCatalog";
import SalesHistory from "@/modules/sales/pages/SalesHistory";
import SaleDetail from "@/modules/sales/pages/SaleDetail";
import POS from "@/modules/sales/pages/POS";
import InventoryPage from "@/modules/inventories/pages/InventoryPage";
import CashRegisterList from "@/modules/cashRegister/pages/CashRegisterList";
import CreateCashRegister from "@/modules/cashRegister/pages/CreateCashRegister";
import CashRegisterDetail from "@/modules/cashRegister/pages/CashRegisterDetail";
import ReturnsList from "@/modules/returns/pages/ReturnsList";
import CreateReturn from "@/modules/returns/pages/CreateReturn";
import ReturnDetail from "@/modules/returns/pages/ReturnDetail";

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
                path: "/sales/detail/:id",
                element: <SaleDetail />,
            },
            {
                path: Routes.POS,
                element: <POS />,
            },
            {
                path: Routes.Inventory,
                element: <InventoryPage />,
            },
            {
                path: "/cash-register",
                element: <CashRegisterList />,
            },
            {
                path: "/cash-register/create",
                element: <CreateCashRegister />,
            },
            {
                path: "/cash-register/detail/:id",
                element: <CashRegisterDetail />,
            },
            {
                path: "/returns",
                element: <ReturnsList />,
            },
            {
                path: "/returns/create",
                element: <CreateReturn />,
            },
            {
                path: "/returns/detail/:id",
                element: <ReturnDetail />,
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
