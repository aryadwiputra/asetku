import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserDelegationController::store
* @see app/Http/Controllers/UserDelegationController.php:16
* @route '/delegations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/delegations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserDelegationController::store
* @see app/Http/Controllers/UserDelegationController.php:16
* @route '/delegations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserDelegationController::store
* @see app/Http/Controllers/UserDelegationController.php:16
* @route '/delegations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserDelegationController::approve
* @see app/Http/Controllers/UserDelegationController.php:86
* @route '/delegations/{delegation}/approve'
*/
export const approve = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/delegations/{delegation}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserDelegationController::approve
* @see app/Http/Controllers/UserDelegationController.php:86
* @route '/delegations/{delegation}/approve'
*/
approve.url = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delegation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { delegation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            delegation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        delegation: typeof args.delegation === 'object'
        ? args.delegation.id
        : args.delegation,
    }

    return approve.definition.url
            .replace('{delegation}', parsedArgs.delegation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserDelegationController::approve
* @see app/Http/Controllers/UserDelegationController.php:86
* @route '/delegations/{delegation}/approve'
*/
approve.post = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserDelegationController::revoke
* @see app/Http/Controllers/UserDelegationController.php:108
* @route '/delegations/{delegation}'
*/
export const revoke = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

revoke.definition = {
    methods: ["delete"],
    url: '/delegations/{delegation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserDelegationController::revoke
* @see app/Http/Controllers/UserDelegationController.php:108
* @route '/delegations/{delegation}'
*/
revoke.url = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delegation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { delegation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            delegation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        delegation: typeof args.delegation === 'object'
        ? args.delegation.id
        : args.delegation,
    }

    return revoke.definition.url
            .replace('{delegation}', parsedArgs.delegation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserDelegationController::revoke
* @see app/Http/Controllers/UserDelegationController.php:108
* @route '/delegations/{delegation}'
*/
revoke.delete = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserDelegationController::start
* @see app/Http/Controllers/UserDelegationController.php:130
* @route '/delegations/{delegation}/start'
*/
export const start = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/delegations/{delegation}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserDelegationController::start
* @see app/Http/Controllers/UserDelegationController.php:130
* @route '/delegations/{delegation}/start'
*/
start.url = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delegation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { delegation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            delegation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        delegation: typeof args.delegation === 'object'
        ? args.delegation.id
        : args.delegation,
    }

    return start.definition.url
            .replace('{delegation}', parsedArgs.delegation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserDelegationController::start
* @see app/Http/Controllers/UserDelegationController.php:130
* @route '/delegations/{delegation}/start'
*/
start.post = (args: { delegation: number | { id: number } } | [delegation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserDelegationController::stop
* @see app/Http/Controllers/UserDelegationController.php:168
* @route '/delegations/stop'
*/
export const stop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/delegations/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserDelegationController::stop
* @see app/Http/Controllers/UserDelegationController.php:168
* @route '/delegations/stop'
*/
stop.url = (options?: RouteQueryOptions) => {
    return stop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserDelegationController::stop
* @see app/Http/Controllers/UserDelegationController.php:168
* @route '/delegations/stop'
*/
stop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

const UserDelegationController = { store, approve, revoke, start, stop }

export default UserDelegationController