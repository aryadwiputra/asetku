import * as React from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
    value: string | number
    label: string
}

type MultiSelectProps = {
    options: MultiSelectOption[]
    selected: (string | number)[]
    onChange: (selected: (string | number)[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    disabled?: boolean
    error?: string
    label?: string
    required?: boolean
    className?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No item found.",
    disabled = false,
    error,
    label,
    required = false,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const selectedOptions = React.useMemo(() => {
        return options.filter((opt) => selected.includes(opt.value))
    }, [options, selected])

    const filteredOptions = React.useMemo(() => {
        if (!search) return options
        const lower = search.toLowerCase()
        return options.filter((opt) => opt.label.toLowerCase().includes(lower))
    }, [options, search])

    function toggleOption(value: string | number) {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value))
        } else {
            onChange([...selected, value])
        }
    }

    function removeOption(value: string | number, e: React.MouseEvent) {
        e.stopPropagation()
        onChange(selected.filter((v) => v !== value))
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full min-h-[42px] h-auto flex-wrap justify-start gap-1 py-1 px-2",
                            selected.length === 0 && "text-muted-foreground",
                            error && "border-destructive"
                        )}
                        onClick={() => setOpen(!open)}
                    >
                        {selected.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedOptions.map((opt) => (
                                    <Badge
                                        key={opt.value}
                                        variant="secondary"
                                        className="h-6 px-2 text-xs gap-1"
                                    >
                                        {opt.label}
                                        <XIcon
                                            className="size-3 cursor-pointer hover:text-destructive"
                                            onClick={(e) => removeOption(opt.value, e)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="truncate">{placeholder}</span>
                        )}
                        <ChevronDownIcon className={cn(
                            "size-4 ml-auto transition-transform",
                            open && "rotate-180"
                        )} />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="p-2 border-b">
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8"
                        />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </p>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 cursor-pointer hover:bg-accent"
                                    onClick={() => toggleOption(opt.value)}
                                >
                                    <Checkbox
                                        checked={selected.includes(opt.value)}
                                        className="pointer-events-none"
                                    />
                                    <span className="flex-1 text-sm">{opt.label}</span>
                                    {selected.includes(opt.value) && (
                                        <CheckIcon className="size-4 text-muted-foreground" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    )
}
