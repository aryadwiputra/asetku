import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'

/**
* @see \App\Http\Controllers\AssetLifecycleController::index
* @see app/Http/Controllers/AssetLifecycleController.php
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

index.url = (options?: RouteQueryOptions) => index.definition.url + queryParams(options)
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({ url: index.url(options), method: 'get' })
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({ url: index.url(options), method: 'head' })

const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({ action: index.url(options), method: 'get' })
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
})
index.form = indexForm

/**
* @see \App\Http\Controllers\AssetLifecycleController::byToken
* @see app/Http/Controllers/AssetLifecycleController.php
* @route '/asset-lifecycle/by-token/{token}'
*/
export const byToken = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

byToken.definition = {
    methods: ["get","head"],
    url: '/asset-lifecycle/by-token/{token}',
} satisfies RouteDefinition<["get","head"]>

byToken.url = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = { token: args[0] }
    }

    args = applyUrlDefaults(args)

    return byToken.definition.url
        .replace('{token}', args.token.toString())
        .replace(/\/+$/, '') + queryParams(options)
}

byToken.get = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})
byToken.head = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byToken.url(args, options),
    method: 'head',
})

const byTokenForm = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})
byTokenForm.get = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})
byTokenForm.head = (args: { token: string | number } | [token: string | number] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
})
byToken.form = byTokenForm

/**
* @see \App\Http\Controllers\AssetLifecycleController::show
* @see app/Http/Controllers/AssetLifecycleController.php
* @route '/asset-lifecycle/{asset}'
*/
export const show = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/asset-lifecycle/{asset}',
} satisfies RouteDefinition<["get","head"]>

show.url = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = { asset: args[0] }
    }

    args = applyUrlDefaults(args)

    const assetId = typeof args.asset === 'object' ? args.asset.id : args.asset

    return show.definition.url
        .replace('{asset}', assetId.toString())
        .replace(/\/+$/, '') + queryParams(options)
}

show.get = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
show.head = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const showForm = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})
showForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})
showForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
})
show.form = showForm

const AssetLifecycleController = { index, byToken, show }

export default AssetLifecycleController

