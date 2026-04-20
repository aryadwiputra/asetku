import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::store
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/asset-lifecycle/{asset}/condition',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetLifecycleConditionController::store
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
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
* @see \App\Http\Controllers\AssetLifecycleConditionController::store
* @see app/Http/Controllers/AssetLifecycleConditionController.php:15
* @route '/asset-lifecycle/{asset}/condition'
*/
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

const AssetLifecycleConditionController = { store }

export default AssetLifecycleConditionController