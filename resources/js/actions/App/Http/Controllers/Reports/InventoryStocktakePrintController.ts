import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::show
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:14
* @route '/reports/inventory/stocktake/print'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/reports/inventory/stocktake/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::show
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:14
* @route '/reports/inventory/stocktake/print'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::show
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:14
* @route '/reports/inventory/stocktake/print'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::show
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:14
* @route '/reports/inventory/stocktake/print'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

const InventoryStocktakePrintController = { show }

export default InventoryStocktakePrintController