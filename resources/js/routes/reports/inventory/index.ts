import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import stocktake from './stocktake'
/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:21
* @route '/reports/inventory'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const inventory = {
    index: Object.assign(index, index),
    stocktake: Object.assign(stocktake, stocktake),
}

export default inventory