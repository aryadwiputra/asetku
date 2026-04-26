import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ColumnPreferenceController::store
* @see app/Http/Controllers/ColumnPreferenceController.php:14
* @route '/column-preferences'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/column-preferences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ColumnPreferenceController::store
* @see app/Http/Controllers/ColumnPreferenceController.php:14
* @route '/column-preferences'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ColumnPreferenceController::store
* @see app/Http/Controllers/ColumnPreferenceController.php:14
* @route '/column-preferences'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const ColumnPreferenceController = { store }

export default ColumnPreferenceController