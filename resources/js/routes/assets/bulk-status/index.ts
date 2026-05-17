import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetBulkStatusController::store
* @see app/Http/Controllers/AssetBulkStatusController.php:16
* @route '/assets/bulk-status'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/bulk-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetBulkStatusController::store
* @see app/Http/Controllers/AssetBulkStatusController.php:16
* @route '/assets/bulk-status'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetBulkStatusController::store
* @see app/Http/Controllers/AssetBulkStatusController.php:16
* @route '/assets/bulk-status'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetBulkStatusController::store
* @see app/Http/Controllers/AssetBulkStatusController.php:16
* @route '/assets/bulk-status'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetBulkStatusController::store
* @see app/Http/Controllers/AssetBulkStatusController.php:16
* @route '/assets/bulk-status'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const bulkStatus = {
    store: Object.assign(store, store),
}

export default bulkStatus