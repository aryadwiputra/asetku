import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::approve
* @see app/Http/Controllers/AssetDisposalApprovalController.php:13
* @route '/disposals/{disposal}/approve'
*/
export const approve = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/disposals/{disposal}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::approve
* @see app/Http/Controllers/AssetDisposalApprovalController.php:13
* @route '/disposals/{disposal}/approve'
*/
approve.url = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{disposal}', parsedArgs.disposal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::approve
* @see app/Http/Controllers/AssetDisposalApprovalController.php:13
* @route '/disposals/{disposal}/approve'
*/
approve.post = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::reject
* @see app/Http/Controllers/AssetDisposalApprovalController.php:29
* @route '/disposals/{disposal}/reject'
*/
export const reject = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/disposals/{disposal}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::reject
* @see app/Http/Controllers/AssetDisposalApprovalController.php:29
* @route '/disposals/{disposal}/reject'
*/
reject.url = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{disposal}', parsedArgs.disposal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetDisposalApprovalController::reject
* @see app/Http/Controllers/AssetDisposalApprovalController.php:29
* @route '/disposals/{disposal}/reject'
*/
reject.post = (args: { disposal: number | { id: number } } | [disposal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

const AssetDisposalApprovalController = { approve, reject }

export default AssetDisposalApprovalController