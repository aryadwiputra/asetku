import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:22
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
* @see app/Http/Controllers/Reports/InventoryReportController.php:22
* @route '/reports/inventory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:22
* @route '/reports/inventory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryReportController::index
* @see app/Http/Controllers/Reports/InventoryReportController.php:22
* @route '/reports/inventory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const InventoryReportController = { index }

export default InventoryReportController