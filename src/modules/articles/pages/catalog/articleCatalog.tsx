import { Button } from "@/components/elements/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import { getArticleColumns } from "./components/ArticleColumns";
import { ArticleDataTable } from "./components/ArticleDataTable";
import { ArticleForm } from "./components/ArticleForm";
import { useCatalogHandler } from "./articleCatalogHandler";

const ArticleCatalog = () => {
    const {
        articles,
        isLoading,
        isSheetOpen,
        selectedArticle,
        setIsSheetOpen,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    } = useCatalogHandler();

    const columns = getArticleColumns({
        article: {} as any, // This prop is not used in column definition generation logic specifically but required by interface
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
                <Button onClick={handleCreate}>Create Article</Button>
            </div>

            {isLoading && articles.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <ArticleDataTable columns={columns} data={articles} />
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedArticle ? "Edit Article" : "Create Article"}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <ArticleForm
                            initialData={selectedArticle ? { ...selectedArticle, id: selectedArticle.id } : undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsSheetOpen(false)}
                            isLoading={isLoading}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default ArticleCatalog;
