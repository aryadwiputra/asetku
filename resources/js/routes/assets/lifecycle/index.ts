import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/asset-lifecycle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php:23
* @route '/asset-lifecycle'
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
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
export const byToken = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

byToken.definition = {
    methods: ["get","head"],
    url: '/asset-lifecycle/by-token/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
byToken.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return byToken.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
byToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
byToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
const byTokenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
byTokenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php:119
* @route '/asset-lifecycle/by-token/{token}'
*/
byTokenForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

byToken.form = byTokenForm

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
export const show = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/asset-lifecycle/{asset}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
show.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return show.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
show.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
show.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
const showForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
showForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php:43
* @route '/asset-lifecycle/{asset}'
*/
showForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::status
* @see app/Http/Controllers/AssetLifecycleStatusController.php:15
* @route '/asset-lifecycle/{asset}/status'
*/
export const status = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/asset-lifecycle/{asset}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::status
* @see app/Http/Controllers/AssetLifecycleStatusController.php:15
* @route '/asset-lifecycle/{asset}/status'
*/
status.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return status.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::status
* @see app/Http/Controllers/AssetLifecycleStatusController.php:15
* @route '/asset-lifecycle/{asset}/status'
*/
status.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::status
* @see app/Http/Controllers/AssetLifecycleStatusController.php:15
* @route '/asset-lifecycle/{asset}/status'
*/
const statusForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::status
* @see app/Http/Controllers/AssetLifecycleStatusController.php:15
* @route '/asset-lifecycle/{asset}/status'
*/
statusForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::condition
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
export const condition = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: condition.url(args, options),
    method: 'post',
})

condition.definition = {
    methods: ["post"],
    url: '/asset-lifecycle/{asset}/condition',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::condition
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
condition.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return condition.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::condition
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
condition.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: condition.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::condition
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
const conditionForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: condition.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::condition
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
conditionForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: condition.url(args, options),
    method: 'post',
})

condition.form = conditionForm

const lifecycle = {
    index: Object.assign(index, index),
    byToken: Object.assign(byToken, byToken),
    show: Object.assign(show, show),
    status: Object.assign(status, status),
    condition: Object.assign(condition, condition),
}

export default lifecycle