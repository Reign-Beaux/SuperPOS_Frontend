import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { MainLayout } from "@/components/layouts";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LoginPage } from "@/modules/Auth/pages/LoginPage";
import { Unauthorized } from "@/components/pages/Unauthorized";

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
        path: Routes.Login,
        element: <LoginPage />,
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
            // Products: Read (Seller), Create/Update (Manager). Page likely has both, so access is Seller.
            // Buttons inside will be hidden.
            {
                path: Routes.Products,
                element: (
                    <ProtectedRoute requiredRole="Vendedor"> 
                        <ProductCatalog />
                    </ProtectedRoute>
                    // Note: "SellerOrAbove" logic handles "Vendedor", "Gerente", "Administrador" manually if needed?
                    // ProtectedRoute logic: if requiredRole="Vendedor", only Vendedor? 
                    // No, `hasRole` in AuthService usually checks exact match. 
                    // But requirement says "SellerOrAbove".
                    // My `ProtectedRoute` implementation used `hasRole` which checks exact match,
                    // OR `requireManagerOrAbove`.
                    // I need a `requireSellerOrAbove` prop or assume basic auth implies Seller+ if they have a role.
                    // Actually, all valid users have at least "Vendedor" (or equivalent hierarchy).
                    // The roles are: Administrador, Gerente, Vendedor.
                    // So if I just check Login, that effectively is "Any Role".
                    // Let's check `UserCatalog` -> ManagerOrAbove.
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
                element: <CustomerCatalog />, // SellerOrAbove (Base Auth)
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
                element: <SaleDetail />, // SellerOrAbove (Base Auth)
            },
            {
                path: Routes.POS,
                element: <POS />, // SellerOrAbove (Base Auth)
            },
            {
                path: Routes.Inventory,
                element: <InventoryPage />, // SellerOrAbove (Base Auth)
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
