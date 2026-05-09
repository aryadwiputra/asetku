import * as React from "react"
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type AssetOption = {
    id: number
    code: string
    name: string
    branch: { id: number; name: string } | null
}

export type BranchOption = {
    id: number
    name: string
    code: string
}

type AssetMultiSelectProps = {
    assets: AssetOption[]
    branches: BranchOption[]
    selected: number[]
    onChange: (selected: number[]) => void
    placeholder?: string
    searchPlaceholder?: string
    branchAllLabel?: string
    emptyMessage?: string
    disabled?: boolean
    error?: string
    label?: string
    required?: boolean
    className?: string
}

export function AssetMultiSelect({
    assets,
    branches,
    selected,
    onChange,
    placeholder = "Select assets...",
    searchPlaceholder = "Search by code or name...",
    branchAllLabel = "All branches",
    emptyMessage = "No assets found.",
    disabled = false,
    error,
    label,
    required = false,
    className,
}: AssetMultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [branchFilter, setBranchFilter] = React.useState<string>("all")

    const selectedAssets = React.useMemo(() => {
        return assets.filter((asset) => selected.includes(asset.id))
    }, [assets, selected])

    const filteredAssets = React.useMemo(() => {
        let result = assets

        if (branchFilter !== "all") {
            result = result.filter((asset) => asset.branch?.id === parseInt(branchFilter, 10))
        }

        if (search) {
            const lower = search.toLowerCase()
            result = result.filter(
                (asset) =>
                    asset.code.toLowerCase().includes(lower) ||
                    asset.name.toLowerCase().includes(lower)
            )
        }

        return result
    }, [assets, branchFilter, search])

    function toggleAsset(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((v) => v !== id))
        } else {
            onChange([...selected, id])
        }
    }

    function removeAsset(id: number, e: React.MouseEvent) {
        e.stopPropagation()
        onChange(selected.filter((v) => v !== id))
    }

    function clearAll(e: React.MouseEvent) {
        e.stopPropagation()
        onChange([])
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
                            <div className="flex flex-wrap gap-1 max-w-[90%]">
                                {selectedAssets.slice(0, 3).map((asset) => (
                                    <Badge
                                        key={asset.id}
                                        variant="secondary"
                                        className="h-6 px-2 text-xs gap-1 whitespace-nowrap"
                                    >
                                        {asset.code}
                                        <XIcon
                                            className="size-3 cursor-pointer hover:text-destructive"
                                            onClick={(e) => removeAsset(asset.id, e)}
                                        />
                                    </Badge>
                                ))}
                                {selectedAssets.length > 3 && (
                                    <Badge variant="outline" className="h-6 px-2 text-xs">
                                        +{selectedAssets.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <span className="truncate">{placeholder}</span>
                        )}
                        <ChevronDownIcon
                            className={cn(
                                "size-4 ml-auto transition-transform flex-shrink-0",
                                open && "rotate-180"
                            )}
                        />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[500px] p-0" align="start">
                    <div className="border-b p-3 space-y-2">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8 h-9"
                                />
                            </div>
                            <Select value={branchFilter} onValueChange={setBranchFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder={branchAllLabel} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{branchAllLabel}</SelectItem>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={String(branch.id)}>
                                            {branch.code} — {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {selected.length} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={clearAll}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {filteredAssets.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </p>
                        ) : (
                            filteredAssets.map((asset) => (
                                <div
                                    key={asset.id}
                                    className="flex items-center gap-3 rounded-sm px-2 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => toggleAsset(asset.id)}
                                >
                                    <Checkbox
                                        checked={selected.includes(asset.id)}
                                        className="pointer-events-none"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{asset.code}</span>
                                            <span className="text-muted-foreground text-sm">
                                                — {asset.name}
                                            </span>
                                        </div>
                                        {asset.branch && (
                                            <div className="text-xs text-muted-foreground">
                                                {asset.branch.name}
                                            </div>
                                        )}
                                    </div>
                                    {selected.includes(asset.id) && (
                                        <CheckIcon className="size-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}
