import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetMovementController::store
* @see app/Http/Controllers/AssetMovementController.php:20
* @route '/assets/{asset}/movements'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/movements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetMovementController::store
* @see app/Http/Controllers/AssetMovementController.php:20
* @route '/assets/{asset}/movements'
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
* @see \App\Http\Controllers\AssetMovementController::store
* @see app/Http/Controllers/AssetMovementController.php:20
* @route '/assets/{asset}/movements'
*/
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetMovementController::store
* @see app/Http/Controllers/AssetMovementController.php:20
* @route '/assets/{asset}/movements'
*/
const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetMovementController::store
* @see app/Http/Controllers/AssetMovementController.php:20
* @route '/assets/{asset}/movements'
*/
storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const movements = {
    store: Object.assign(store, store),
}

export default movements