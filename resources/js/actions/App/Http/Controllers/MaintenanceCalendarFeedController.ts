import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::show
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
export const show = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/calendars/maintenance/{token}.ics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::show
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
show.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return show.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::show
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
show.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::show
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
show.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const MaintenanceCalendarFeedController = { show }

export default MaintenanceCalendarFeedController