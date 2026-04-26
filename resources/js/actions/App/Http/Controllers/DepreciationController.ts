import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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

const DepreciationController = { index }

export default DepreciationController