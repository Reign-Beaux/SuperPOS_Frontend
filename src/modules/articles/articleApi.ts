import { useHttpClient } from "@/config/httpClient";
import type { Article, CreateArticleRequest, UpdateArticleRequest } from "./models/Article";


const endpoints = {
    getAll: "Article",
    getById: (id: string) => `Article/${id}`,
    create: "Article",
    update: (id: string) => `Article/${id}`,
    delete: (id: string) => `Article/${id}`,
};

export const useArticleApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllArticles = async () => {
        return await get<Article[]>(endpoints.getAll);
    };

    const getArticleById = async (id: string) => {
        return await get<Article>(endpoints.getById(id));
    };

    const createArticle = async (article: CreateArticleRequest) => {
        return await post<CreateArticleRequest, Article>(endpoints.create, article);
    };

    const updateArticle = async (article: UpdateArticleRequest) => {
        const { id, ...data } = article;
        return await put<Omit<UpdateArticleRequest, 'id'>, void>(endpoints.update(id), data);
    };

    const deleteArticle = async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    };

    return {
        getAllArticles,
        getArticleById,
        createArticle,
        updateArticle,
        deleteArticle,
    };
};
