import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import runs from './runs'
import assets from './assets'
/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/depreciation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/depreciation/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::exportMethod
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

const depreciation = {
    index: Object.assign(index, index),
    runs: Object.assign(runs, runs),
    assets: Object.assign(assets, assets),
    export: Object.assign(exportMethod, exportMethod),
}

export default depreciation