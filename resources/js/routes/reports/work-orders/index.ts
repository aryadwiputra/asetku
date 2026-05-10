import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\WorkOrderReportController::index
* @see app/Http/Controllers/Reports/WorkOrderReportController.php:14
* @route '/reports/work-orders'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/work-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkOrderReportController::index
* @see app/Http/Controllers/Reports/WorkOrderReportController.php:14
* @route '/reports/work-orders'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkOrderReportController::index
* @see app/Http/Controllers/Reports/WorkOrderReportController.php:14
* @route '/reports/work-orders'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\WorkOrderReportController::index
* @see app/Http/Controllers/Reports/WorkOrderReportController.php:14
* @route '/reports/work-orders'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const workOrders = {
    index: Object.assign(index, index),
}

export default workOrders