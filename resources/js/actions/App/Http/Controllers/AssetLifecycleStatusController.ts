import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'

/**
* @see \App\Http\Controllers\AssetLifecycleStatusController::store
* @see app/Http/Controllers/AssetLifecycleStatusController.php
* @route '/asset-lifecycle/{asset}/status'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/asset-lifecycle/{asset}/status',
} satisfies RouteDefinition<["post"]>

store.url = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
        .replace('{asset}', assetId.toString())
        .replace(/\/+$/, '') + queryParams(options)
}

store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})
storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})
store.form = storeForm

const AssetLifecycleStatusController = { store }

export default AssetLifecycleStatusController

