import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/depreciation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepreciationController::index
* @see app/Http/Controllers/DepreciationController.php:15
* @route '/depreciation'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const DepreciationController = { index }

export default DepreciationController