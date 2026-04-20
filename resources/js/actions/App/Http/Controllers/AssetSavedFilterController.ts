import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetSavedFilterController::store
* @see app/Http/Controllers/AssetSavedFilterController.php:13
* @route '/assets-saved-filters'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets-saved-filters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetSavedFilterController::store
* @see app/Http/Controllers/AssetSavedFilterController.php:13
* @route '/assets-saved-filters'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetSavedFilterController::store
* @see app/Http/Controllers/AssetSavedFilterController.php:13
* @route '/assets-saved-filters'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetSavedFilterController::update
* @see app/Http/Controllers/AssetSavedFilterController.php:52
* @route '/assets-saved-filters/{savedFilter}'
*/
export const update = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/assets-saved-filters/{savedFilter}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AssetSavedFilterController::update
* @see app/Http/Controllers/AssetSavedFilterController.php:52
* @route '/assets-saved-filters/{savedFilter}'
*/
update.url = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savedFilter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { savedFilter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            savedFilter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        savedFilter: typeof args.savedFilter === 'object'
        ? args.savedFilter.id
        : args.savedFilter,
    }

    return update.definition.url
            .replace('{savedFilter}', parsedArgs.savedFilter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetSavedFilterController::update
* @see app/Http/Controllers/AssetSavedFilterController.php:52
* @route '/assets-saved-filters/{savedFilter}'
*/
update.patch = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AssetSavedFilterController::destroy
* @see app/Http/Controllers/AssetSavedFilterController.php:90
* @route '/assets-saved-filters/{savedFilter}'
*/
export const destroy = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assets-saved-filters/{savedFilter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetSavedFilterController::destroy
* @see app/Http/Controllers/AssetSavedFilterController.php:90
* @route '/assets-saved-filters/{savedFilter}'
*/
destroy.url = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savedFilter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { savedFilter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            savedFilter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        savedFilter: typeof args.savedFilter === 'object'
        ? args.savedFilter.id
        : args.savedFilter,
    }

    return destroy.definition.url
            .replace('{savedFilter}', parsedArgs.savedFilter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetSavedFilterController::destroy
* @see app/Http/Controllers/AssetSavedFilterController.php:90
* @route '/assets-saved-filters/{savedFilter}'
*/
destroy.delete = (args: { savedFilter: number | { id: number } } | [savedFilter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const AssetSavedFilterController = { store, update, destroy }

export default AssetSavedFilterController