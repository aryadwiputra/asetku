import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::print
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:15
* @route '/reports/inventory/stocktake/print'
*/
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/reports/inventory/stocktake/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::print
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:15
* @route '/reports/inventory/stocktake/print'
*/
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::print
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:15
* @route '/reports/inventory/stocktake/print'
*/
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\InventoryStocktakePrintController::print
* @see app/Http/Controllers/Reports/InventoryStocktakePrintController.php:15
* @route '/reports/inventory/stocktake/print'
*/
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

const stocktake = {
    print: Object.assign(print, print),
}

export default stocktake