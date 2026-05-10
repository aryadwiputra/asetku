import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetDisposalBaController::show
* @see app/Http/Controllers/AssetDisposalBaController.php:16
* @route '/disposals/{disposal}/ba'
*/
export const show = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/disposals/{disposal}/ba',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetDisposalBaController::show
* @see app/Http/Controllers/AssetDisposalBaController.php:16
* @route '/disposals/{disposal}/ba'
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
* @see \App\Http\Controllers\AssetDisposalBaController::show
* @see app/Http/Controllers/AssetDisposalBaController.php:16
* @route '/disposals/{disposal}/ba'
*/
show.get = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetDisposalBaController::show
* @see app/Http/Controllers/AssetDisposalBaController.php:16
* @route '/disposals/{disposal}/ba'
*/
show.head = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const AssetDisposalBaController = { show }

export default AssetDisposalBaController