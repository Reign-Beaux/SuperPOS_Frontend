import { MainLayout } from "@/components/layouts";
import { Unauthorized } from "@/components/pages/Unauthorized";
import { ForgotPasswordPage } from "@/modules/Auth/pages/ForgotPasswordPage";
import { LoginPage } from "@/modules/Auth/pages/LoginPage";
import { ResetPasswordPage } from "@/modules/Auth/pages/ResetPasswordPage";
import { VerifyCodePage } from "@/modules/Auth/pages/VerifyCodePage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";

import { Dashboard } from "@/components/pages/Dashboard";
import CashRegisterDetail from "@/modules/cashRegister/pages/CashRegisterDetail";
import CashRegisterList from "@/modules/cashRegister/pages/CashRegisterList";
import CreateCashRegister from "@/modules/cashRegister/pages/CreateCashRegister";
import CustomerCatalog from "@/modules/customers/pages/catalog/CustomerCatalog";
import InventoryPage from "@/modules/inventories/pages/InventoryPage";
import ProductCatalog from "@/modules/products/pages/catalog/productCatalog";
import CreateReturn from "@/modules/returns/pages/CreateReturn";
import ReturnDetail from "@/modules/returns/pages/ReturnDetail";
import ReturnsList from "@/modules/returns/pages/ReturnsList";
import RoleCatalog from "@/modules/roles/pages/catalog/RoleCatalog";
import POS from "@/modules/sales/pages/POS";
import SaleDetail from "@/modules/sales/pages/SaleDetail";
import SalesHistory from "@/modules/sales/pages/SalesHistory";
import UserCatalog from "@/modules/users/pages/catalog/userCatalog";

const routes = [
    {
        path: Routes.Login,
        element: <LoginPage />,
    },
    {
        path: Routes.ForgotPassword,
        element: <ForgotPasswordPage />,
    },
    {
        path: Routes.VerifyCode,
        element: <VerifyCodePage />,
    },
    {
        path: Routes.ResetPassword,
        element: <ResetPasswordPage />,
    },
    {
        path: Routes.Unauthorized,
        element: <Unauthorized />,
    },
    {
        path: Routes.Home,
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: Routes.Products,
                element: (
                    <ProtectedRoute requireManagerOrAbove> 
                        <ProductCatalog />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.Users,
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <UserCatalog />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.Customers,
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <CustomerCatalog />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.Roles,
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                         <RoleCatalog />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.Sales,
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <SalesHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/sales/detail/:id",
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <SaleDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.POS,
                element: (
                    <ProtectedRoute allowedRoles={['Vendedor', 'Administrador']}>
                        <POS />
                    </ProtectedRoute>
                ),
            },
            {
                path: Routes.Inventory,
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <InventoryPage />
                    </ProtectedRoute>
                ),
            },
            // Cash Register: ManagerOrAbove
            {
                path: "/cash-register",
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <CashRegisterList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cash-register/create",
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <CreateCashRegister />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cash-register/detail/:id",
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <CashRegisterDetail />
                    </ProtectedRoute>
                ),
            },
            // Returns
            {
                path: "/returns", // List -> ManagerOrAbove
                element: (
                    <ProtectedRoute requireManagerOrAbove>
                        <ReturnsList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/returns/create", // Create -> SellerOrAbove
                element: <CreateReturn />,
            },
            {
                path: "/returns/detail/:id", // Detail -> SellerOrAbove
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
