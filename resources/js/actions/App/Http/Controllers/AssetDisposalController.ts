import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/disposals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::index
* @see app/Http/Controllers/AssetDisposalController.php:21
* @route '/disposals'
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
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/disposals/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::create
* @see app/Http/Controllers/AssetDisposalController.php:68
* @route '/disposals/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
*/
export const byToken = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

byToken.definition = {
    methods: ["get","head"],
    url: '/disposals/by-token/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
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
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
*/
byToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
*/
byToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
*/
const byTokenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
*/
byTokenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::byToken
* @see app/Http/Controllers/AssetDisposalController.php:97
* @route '/disposals/by-token/{token}'
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
* @see \App\Http\Controllers\AssetDisposalController::store
* @see app/Http/Controllers/AssetDisposalController.php:109
* @route '/disposals'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/disposals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetDisposalController::store
* @see app/Http/Controllers/AssetDisposalController.php:109
* @route '/disposals'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalController::store
* @see app/Http/Controllers/AssetDisposalController.php:109
* @route '/disposals'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::store
* @see app/Http/Controllers/AssetDisposalController.php:109
* @route '/disposals'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::store
* @see app/Http/Controllers/AssetDisposalController.php:109
* @route '/disposals'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
export const show = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/disposals/{disposal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
show.url = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { disposal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { disposal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            disposal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        disposal: typeof args.disposal === 'object'
        ? args.disposal.id
        : args.disposal,
    }

    return show.definition.url
            .replace('{disposal}', parsedArgs.disposal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
show.get = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
show.head = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
const showForm = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
showForm.get = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalController::show
* @see app/Http/Controllers/AssetDisposalController.php:131
* @route '/disposals/{disposal}'
*/
showForm.head = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const AssetDisposalController = { index, create, byToken, store, show }

export default AssetDisposalController