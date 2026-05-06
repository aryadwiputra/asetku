import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
export const feed = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(args, options),
    method: 'get',
})

feed.definition = {
    methods: ["get","head"],
    url: '/calendars/maintenance/{token}.ics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
feed.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return feed.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
feed.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
feed.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feed.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
const feedForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
feedForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedController::feed
* @see app/Http/Controllers/MaintenanceCalendarFeedController.php:15
* @route '/calendars/maintenance/{token}.ics'
*/
feedForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

feed.form = feedForm

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

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarController::index
* @see app/Http/Controllers/MaintenanceCalendarController.php:18
* @route '/maintenance-calendar'
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

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
const eventsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
eventsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarEventsController::events
* @see app/Http/Controllers/MaintenanceCalendarEventsController.php:16
* @route '/maintenance-calendar/events'
*/
eventsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

events.form = eventsForm

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::feedToken
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
export const feedToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedToken.url(options),
    method: 'post',
})

feedToken.definition = {
    methods: ["post"],
    url: '/maintenance-calendar/feed-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::feedToken
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
feedToken.url = (options?: RouteQueryOptions) => {
    return feedToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::feedToken
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
feedToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::feedToken
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
const feedTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: feedToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MaintenanceCalendarFeedTokenController::feedToken
* @see app/Http/Controllers/MaintenanceCalendarFeedTokenController.php:15
* @route '/maintenance-calendar/feed-token'
*/
feedTokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: feedToken.url(options),
    method: 'post',
})

feedToken.form = feedTokenForm

const maintenanceCalendar = {
    feed: Object.assign(feed, feed),
    index: Object.assign(index, index),
    events: Object.assign(events, events),
    feedToken: Object.assign(feedToken, feedToken),
}

export default maintenanceCalendar