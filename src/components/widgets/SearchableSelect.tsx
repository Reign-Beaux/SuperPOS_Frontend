import { useDebounce } from "@/hooks/useDebounce"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/elements/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/elements/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/elements/popover"
import { cn } from "@/config/material/utils"

export interface GenericOption {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options?: GenericOption[];
    value?: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    onSearch?: (term: string) => Promise<GenericOption[]>;
    debounceTime?: number;
}

export function SearchableSelect({
    options: initialOptions = [],
    value,
    onSelect,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    className,
    onSearch,
    debounceTime = 500
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [internalOptions, setInternalOptions] = React.useState<GenericOption[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedLabel, setSelectedLabel] = React.useState("")

    // Use external options if provided and onSearch is not used (static mode)
    // If onSearch is used, use internalOptions (async mode)
    // However, for async mode, we might need to pre-populate label if value exists but options don't have it yet.
    // Ideally, the parent passes the initial options or we fetch them. 
    // For now, let's assume if static options are passed, we use them.
    const activeOptions = onSearch ? internalOptions : initialOptions;

    // Resolve selected label from value
    React.useEffect(() => {
        if (!value) {
            setSelectedLabel("");
            return;
        }
        // Try to find in current active options
        const found = activeOptions.find(o => o.value === value);
        if (found) {
            setSelectedLabel(found.label);
        }
        // If not found in active options (e.g. async search hasn't loaded it), 
        // we might display the value or need a way to get the label.
        // For this implementation, we will rely on what we have.
    }, [value, activeOptions]);


    const debouncedSearchTerm = useDebounce(searchTerm, debounceTime)

    React.useEffect(() => {
        if (!onSearch) return;

        const fetchOptions = async () => {
            if (debouncedSearchTerm.length < 3) {
                setInternalOptions([]);
                return;
            }

            setLoading(true);
            try {
                const results = await onSearch(debouncedSearchTerm);
                setInternalOptions(results);
            } catch (error) {
                console.error("Search failed", error);
                setInternalOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [debouncedSearchTerm, onSearch]);

    const handleSelect = (currentValue: string, label: string) => {
        onSelect(currentValue === value ? "" : currentValue)
        setSelectedLabel(label)
        setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearchTerm("");
            if (onSearch) {
                setInternalOptions([]);
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command
                    shouldFilter={!onSearch}
                    filter={onSearch ? () => 1 : undefined}
                >
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        autoComplete="off"
                    />
                    <CommandList>
                        {loading && (
                            <div className="py-6 text-center text-sm flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Searching...
                            </div>
                        )}
                        {!loading && activeOptions.length === 0 && (
                            <CommandEmpty>
                                {onSearch && searchTerm.length < 3
                                    ? "Type at least 3 characters..."
                                    : emptyMessage}
                            </CommandEmpty>
                        )}
                        <CommandGroup>
                            {activeOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={`${option.label}__${option.value}`}
                                    onSelect={() => handleSelect(option.value, option.label)}
                                    className="data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

