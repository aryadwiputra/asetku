import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/assets-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetExportController::exportMethod
* @see app/Http/Controllers/AssetExportController.php:15
* @route '/assets-export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

const AssetExportController = { exportMethod, export: exportMethod }

export default AssetExportController