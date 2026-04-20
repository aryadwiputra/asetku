import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DepreciationRunController::store
* @see app/Http/Controllers/DepreciationRunController.php:14
* @route '/depreciation/runs'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/depreciation/runs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DepreciationRunController::store
* @see app/Http/Controllers/DepreciationRunController.php:14
* @route '/depreciation/runs'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepreciationRunController::store
* @see app/Http/Controllers/DepreciationRunController.php:14
* @route '/depreciation/runs'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const DepreciationRunController = { store }

export default DepreciationRunController