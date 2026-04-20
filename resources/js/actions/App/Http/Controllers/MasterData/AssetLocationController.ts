import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::index
* @see app/Http/Controllers/MasterData/AssetLocationController.php:16
* @route '/settings/master-data/asset-locations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::index
* @see app/Http/Controllers/MasterData/AssetLocationController.php:16
* @route '/settings/master-data/asset-locations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::index
* @see app/Http/Controllers/MasterData/AssetLocationController.php:16
* @route '/settings/master-data/asset-locations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::index
* @see app/Http/Controllers/MasterData/AssetLocationController.php:16
* @route '/settings/master-data/asset-locations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::create
* @see app/Http/Controllers/MasterData/AssetLocationController.php:48
* @route '/settings/master-data/asset-locations/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-locations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::create
* @see app/Http/Controllers/MasterData/AssetLocationController.php:48
* @route '/settings/master-data/asset-locations/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::create
* @see app/Http/Controllers/MasterData/AssetLocationController.php:48
* @route '/settings/master-data/asset-locations/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::create
* @see app/Http/Controllers/MasterData/AssetLocationController.php:48
* @route '/settings/master-data/asset-locations/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::store
* @see app/Http/Controllers/MasterData/AssetLocationController.php:61
* @route '/settings/master-data/asset-locations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/asset-locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::store
* @see app/Http/Controllers/MasterData/AssetLocationController.php:61
* @route '/settings/master-data/asset-locations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::store
* @see app/Http/Controllers/MasterData/AssetLocationController.php:61
* @route '/settings/master-data/asset-locations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::edit
* @see app/Http/Controllers/MasterData/AssetLocationController.php:72
* @route '/settings/master-data/asset-locations/{asset_location}/edit'
*/
export const edit = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-locations/{asset_location}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::edit
* @see app/Http/Controllers/MasterData/AssetLocationController.php:72
* @route '/settings/master-data/asset-locations/{asset_location}/edit'
*/
edit.url = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_location: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_location: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_location: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_location: typeof args.asset_location === 'object'
        ? args.asset_location.id
        : args.asset_location,
    }

    return edit.definition.url
            .replace('{asset_location}', parsedArgs.asset_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::edit
* @see app/Http/Controllers/MasterData/AssetLocationController.php:72
* @route '/settings/master-data/asset-locations/{asset_location}/edit'
*/
edit.get = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::edit
* @see app/Http/Controllers/MasterData/AssetLocationController.php:72
* @route '/settings/master-data/asset-locations/{asset_location}/edit'
*/
edit.head = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::update
* @see app/Http/Controllers/MasterData/AssetLocationController.php:87
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
export const update = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/asset-locations/{asset_location}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::update
* @see app/Http/Controllers/MasterData/AssetLocationController.php:87
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
update.url = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_location: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_location: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_location: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_location: typeof args.asset_location === 'object'
        ? args.asset_location.id
        : args.asset_location,
    }

    return update.definition.url
            .replace('{asset_location}', parsedArgs.asset_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::update
* @see app/Http/Controllers/MasterData/AssetLocationController.php:87
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
update.put = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::update
* @see app/Http/Controllers/MasterData/AssetLocationController.php:87
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
update.patch = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::destroy
* @see app/Http/Controllers/MasterData/AssetLocationController.php:98
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
export const destroy = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/asset-locations/{asset_location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::destroy
* @see app/Http/Controllers/MasterData/AssetLocationController.php:98
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
destroy.url = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_location: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_location: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_location: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_location: typeof args.asset_location === 'object'
        ? args.asset_location.id
        : args.asset_location,
    }

    return destroy.definition.url
            .replace('{asset_location}', parsedArgs.asset_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetLocationController::destroy
* @see app/Http/Controllers/MasterData/AssetLocationController.php:98
* @route '/settings/master-data/asset-locations/{asset_location}'
*/
destroy.delete = (args: { asset_location: number | { id: number } } | [asset_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const AssetLocationController = { index, create, store, edit, update, destroy }

export default AssetLocationController