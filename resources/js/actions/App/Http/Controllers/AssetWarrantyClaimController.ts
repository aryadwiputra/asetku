import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::store
* @see app/Http/Controllers/AssetWarrantyClaimController.php:16
* @route '/assets/{asset}/warranty-claims'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/warranty-claims',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::store
* @see app/Http/Controllers/AssetWarrantyClaimController.php:16
* @route '/assets/{asset}/warranty-claims'
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
* @see \App\Http\Controllers\AssetWarrantyClaimController::store
* @see app/Http/Controllers/AssetWarrantyClaimController.php:16
* @route '/assets/{asset}/warranty-claims'
*/
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::store
* @see app/Http/Controllers/AssetWarrantyClaimController.php:16
* @route '/assets/{asset}/warranty-claims'
*/
const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::store
* @see app/Http/Controllers/AssetWarrantyClaimController.php:16
* @route '/assets/{asset}/warranty-claims'
*/
storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::update
* @see app/Http/Controllers/AssetWarrantyClaimController.php:40
* @route '/assets/{asset}/warranty-claims/{claim}'
*/
export const update = (args: { asset: number | { id: number }, claim: number | { id: number } } | [asset: number | { id: number }, claim: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/assets/{asset}/warranty-claims/{claim}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::update
* @see app/Http/Controllers/AssetWarrantyClaimController.php:40
* @route '/assets/{asset}/warranty-claims/{claim}'
*/
update.url = (args: { asset: number | { id: number }, claim: number | { id: number } } | [asset: number | { id: number }, claim: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            asset: args[0],
            claim: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
        claim: typeof args.claim === 'object'
        ? args.claim.id
        : args.claim,
    }

    return update.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{claim}', parsedArgs.claim.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::update
* @see app/Http/Controllers/AssetWarrantyClaimController.php:40
* @route '/assets/{asset}/warranty-claims/{claim}'
*/
update.patch = (args: { asset: number | { id: number }, claim: number | { id: number } } | [asset: number | { id: number }, claim: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::update
* @see app/Http/Controllers/AssetWarrantyClaimController.php:40
* @route '/assets/{asset}/warranty-claims/{claim}'
*/
const updateForm = (args: { asset: number | { id: number }, claim: number | { id: number } } | [asset: number | { id: number }, claim: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetWarrantyClaimController::update
* @see app/Http/Controllers/AssetWarrantyClaimController.php:40
* @route '/assets/{asset}/warranty-claims/{claim}'
*/
updateForm.patch = (args: { asset: number | { id: number }, claim: number | { id: number } } | [asset: number | { id: number }, claim: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const AssetWarrantyClaimController = { store, update }

export default AssetWarrantyClaimController