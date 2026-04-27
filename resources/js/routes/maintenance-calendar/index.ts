import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:17
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
* @see app/Http/Controllers/MaintenanceCalendarController.php:17
* @route '/maintenance-calendar'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:17
* @route '/maintenance-calendar'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:17
* @route '/maintenance-calendar'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
export const events = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})

events.definition = {
    methods: ["get","head"],
    url: '/maintenance-calendar/events',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
events.url = (options?: RouteQueryOptions) => {
    return events.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
events.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
events.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: events.url(options),
    method: 'head',
})

const maintenanceCalendar = {
    index: Object.assign(index, index),
    events: Object.assign(events, events),
}

export default maintenanceCalendar