import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
export const asset = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: asset.url(args, options),
    method: 'get',
})

asset.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/depreciation/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
asset.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return asset.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
asset.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: asset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
asset.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: asset.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
const assetForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: asset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
assetForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: asset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::asset
* @see app/Http/Controllers/DepreciationExportController.php:17
* @route '/assets/{asset}/depreciation/export'
*/
assetForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: asset.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

asset.form = assetForm

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
export const organization = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: organization.url(options),
    method: 'get',
})

organization.definition = {
    methods: ["get","head"],
    url: '/depreciation/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
organization.url = (options?: RouteQueryOptions) => {
    return organization.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
organization.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: organization.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
organization.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: organization.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
const organizationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: organization.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
organizationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: organization.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationExportController::organization
* @see app/Http/Controllers/DepreciationExportController.php:39
* @route '/depreciation/export'
*/
organizationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: organization.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

organization.form = organizationForm

const DepreciationExportController = { asset, organization }

export default DepreciationExportController