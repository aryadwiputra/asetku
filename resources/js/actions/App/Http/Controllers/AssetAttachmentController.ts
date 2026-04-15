import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetAttachmentController::store
* @see app/Http/Controllers/AssetAttachmentController.php:14
* @route '/assets/{asset}/attachments'
*/
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetAttachmentController::store
* @see app/Http/Controllers/AssetAttachmentController.php:14
* @route '/assets/{asset}/attachments'
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
* @see \App\Http\Controllers\AssetAttachmentController::store
* @see app/Http/Controllers/AssetAttachmentController.php:14
* @route '/assets/{asset}/attachments'
*/
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetAttachmentController::store
* @see app/Http/Controllers/AssetAttachmentController.php:14
* @route '/assets/{asset}/attachments'
*/
const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetAttachmentController::store
* @see app/Http/Controllers/AssetAttachmentController.php:14
* @route '/assets/{asset}/attachments'
*/
storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AssetAttachmentController::destroy
* @see app/Http/Controllers/AssetAttachmentController.php:56
* @route '/assets/{asset}/attachments/{assetMedia}'
*/
export const destroy = (args: { asset: number | { id: number }, assetMedia: number | { id: number } } | [asset: number | { id: number }, assetMedia: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assets/{asset}/attachments/{assetMedia}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetAttachmentController::destroy
* @see app/Http/Controllers/AssetAttachmentController.php:56
* @route '/assets/{asset}/attachments/{assetMedia}'
*/
destroy.url = (args: { asset: number | { id: number }, assetMedia: number | { id: number } } | [asset: number | { id: number }, assetMedia: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            asset: args[0],
            assetMedia: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
        assetMedia: typeof args.assetMedia === 'object'
        ? args.assetMedia.id
        : args.assetMedia,
    }

    return destroy.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{assetMedia}', parsedArgs.assetMedia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetAttachmentController::destroy
* @see app/Http/Controllers/AssetAttachmentController.php:56
* @route '/assets/{asset}/attachments/{assetMedia}'
*/
destroy.delete = (args: { asset: number | { id: number }, assetMedia: number | { id: number } } | [asset: number | { id: number }, assetMedia: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AssetAttachmentController::destroy
* @see app/Http/Controllers/AssetAttachmentController.php:56
* @route '/assets/{asset}/attachments/{assetMedia}'
*/
const destroyForm = (args: { asset: number | { id: number }, assetMedia: number | { id: number } } | [asset: number | { id: number }, assetMedia: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetAttachmentController::destroy
* @see app/Http/Controllers/AssetAttachmentController.php:56
* @route '/assets/{asset}/attachments/{assetMedia}'
*/
destroyForm.delete = (args: { asset: number | { id: number }, assetMedia: number | { id: number } } | [asset: number | { id: number }, assetMedia: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AssetAttachmentController = { store, destroy }

export default AssetAttachmentController