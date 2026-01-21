import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { MainLayout } from "@/components/layouts";
import ArticleCatalog from "@/modules/articles/pages/catalog/articleCatalog";

const routes = [
    {
        path: Routes.Home,
        element: (
            <MainLayout />
        ),
        children: [
            {
                path: Routes.Articles,
                element: <ArticleCatalog />,
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
