import type { Column } from "./ProductColumns";

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export function ProductDataTable<T extends { id: string }>({ columns, data }: DataTableProps<T>) {
    return (
        <div className="rounded-md border">
            <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${column.className || ""}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                {columns.map((column, index) => (
                                    <td
                                        key={index}
                                        className={`p-4 align-middle ${column.className || ""}`}
                                    >
                                        {column.cell
                                            ? column.cell(item)
                                            : column.accessorKey
                                                ? (item[column.accessorKey] as React.ReactNode)
                                                : null}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
