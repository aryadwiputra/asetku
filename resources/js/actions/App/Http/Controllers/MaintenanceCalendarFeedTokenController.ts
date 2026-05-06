import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::store
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/maintenance-calendar/feed-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::store
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::store
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::store
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::store
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const MaintenanceCalendarFeedTokenController = { store }

export default MaintenanceCalendarFeedTokenController