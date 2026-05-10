import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetQrTokenController::update
* @see app/Http/Controllers/AssetQrTokenController.php:14
* @route '/assets/{asset}/qr-token'
*/
export const update = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/assets/{asset}/qr-token',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AssetQrTokenController::update
* @see app/Http/Controllers/AssetQrTokenController.php:14
* @route '/assets/{asset}/qr-token'
*/
update.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetQrTokenController::update
* @see app/Http/Controllers/AssetQrTokenController.php:14
* @route '/assets/{asset}/qr-token'
*/
update.patch = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

const AssetQrTokenController = { update }

export default AssetQrTokenController