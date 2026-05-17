import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/maintenance-costs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Reports\MaintenanceCostReportController::index
* @see app/Http/Controllers/Reports/MaintenanceCostReportController.php:14
* @route '/reports/maintenance-costs'
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

const MaintenanceCostReportController = { index }

export default MaintenanceCostReportController