import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import usageLogs from './usage-logs'
/**
* @see \App\Http\Controllers\DepreciationAssetController::show
* @see app/Http/Controllers/DepreciationAssetController.php:15
* @route '/depreciation/assets/{asset}'
*/
export const show = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/depreciation/assets/{asset}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationAssetController::show
* @see app/Http/Controllers/DepreciationAssetController.php:15
* @route '/depreciation/assets/{asset}'
*/
show.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return show.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationAssetController::show
* @see app/Http/Controllers/DepreciationAssetController.php:15
* @route '/depreciation/assets/{asset}'
*/
show.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationAssetController::show
* @see app/Http/Controllers/DepreciationAssetController.php:15
* @route '/depreciation/assets/{asset}'
*/
show.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
export const exportMethod = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/depreciation/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
exportMethod.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return exportMethod.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
exportMethod.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
exportMethod.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

const assets = {
    show: Object.assign(show, show),
    export: Object.assign(exportMethod, exportMethod),
    usageLogs: Object.assign(usageLogs, usageLogs),
}

export default assets