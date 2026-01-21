import { useArticleApi } from "@/modules/articles/articleApi";
import type { Article, CreateArticleRequest, UpdateArticleRequest } from "@/modules/articles/models/Article";
import type { ArticleFormValues } from "@/modules/articles/schemes/ArticleScheme";
import { useEffect, useState } from "react";

export const useCatalogHandler = () => {
    const { getAllArticles, createArticle, updateArticle, deleteArticle } = useArticleApi();

    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const loadArticles = async () => {
        setIsLoading(true);
        try {
            const data = await getAllArticles();
            setArticles(data);
        } catch (error) {
            if (error instanceof Error && error.message === "Request cancelled") return;
            console.error("Failed to load articles", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedArticle(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (article: Article) => {
        setSelectedArticle(article);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            await deleteArticle(id);
            await loadArticles();
        } catch (error) {
            console.error("Failed to delete article", error);
        }
    };

    const handleSubmit = async (values: ArticleFormValues) => {
        setIsLoading(true);
        try {
            if (selectedArticle) {
                const updateRequest: UpdateArticleRequest = {
                    id: selectedArticle.id,
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await updateArticle(updateRequest);
            } else {
                const createRequest: CreateArticleRequest = {
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await createArticle(createRequest);
            }
            setIsSheetOpen(false);
            await loadArticles();
        } catch (error) {
            console.error("Failed to save article", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    return {
        articles,
        isLoading,
        isSheetOpen,
        selectedArticle,
        setIsSheetOpen,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    };
};
