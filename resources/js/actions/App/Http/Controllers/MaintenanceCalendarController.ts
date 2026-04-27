import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/maintenance-calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const MaintenanceCalendarController = { index }

export default MaintenanceCalendarController