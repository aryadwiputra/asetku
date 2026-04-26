import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetLifecycleEventController::store
* @see app/Http/Controllers/AssetLifecycleEventController.php:14
* @route '/assets/{asset}/lifecycle-events'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/lifecycle-events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetLifecycleEventController::store
* @see app/Http/Controllers/AssetLifecycleEventController.php:14
* @route '/assets/{asset}/lifecycle-events'
*/
store.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLifecycleEventController::store
* @see app/Http/Controllers/AssetLifecycleEventController.php:14
* @route '/assets/{asset}/lifecycle-events'
*/
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleEventController::store
* @see app/Http/Controllers/AssetLifecycleEventController.php:14
* @route '/assets/{asset}/lifecycle-events'
*/
const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetLifecycleEventController::store
* @see app/Http/Controllers/AssetLifecycleEventController.php:14
* @route '/assets/{asset}/lifecycle-events'
*/
storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const lifecycleEvents = {
    store: Object.assign(store, store),
}

export default lifecycleEvents