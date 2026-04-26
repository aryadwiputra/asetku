import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\WarrantyController::index
* @see app/Http/Controllers/MasterData/WarrantyController.php:16
* @route '/settings/master-data/warranties'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/warranties',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::index
* @see app/Http/Controllers/MasterData/WarrantyController.php:16
* @route '/settings/master-data/warranties'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::index
* @see app/Http/Controllers/MasterData/WarrantyController.php:16
* @route '/settings/master-data/warranties'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::index
* @see app/Http/Controllers/MasterData/WarrantyController.php:16
* @route '/settings/master-data/warranties'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::create
* @see app/Http/Controllers/MasterData/WarrantyController.php:45
* @route '/settings/master-data/warranties/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/warranties/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::create
* @see app/Http/Controllers/MasterData/WarrantyController.php:45
* @route '/settings/master-data/warranties/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::create
* @see app/Http/Controllers/MasterData/WarrantyController.php:45
* @route '/settings/master-data/warranties/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::create
* @see app/Http/Controllers/MasterData/WarrantyController.php:45
* @route '/settings/master-data/warranties/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::store
* @see app/Http/Controllers/MasterData/WarrantyController.php:52
* @route '/settings/master-data/warranties'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/warranties',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::store
* @see app/Http/Controllers/MasterData/WarrantyController.php:52
* @route '/settings/master-data/warranties'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::store
* @see app/Http/Controllers/MasterData/WarrantyController.php:52
* @route '/settings/master-data/warranties'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::edit
* @see app/Http/Controllers/MasterData/WarrantyController.php:63
* @route '/settings/master-data/warranties/{warranty}/edit'
*/
export const edit = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/warranties/{warranty}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::edit
* @see app/Http/Controllers/MasterData/WarrantyController.php:63
* @route '/settings/master-data/warranties/{warranty}/edit'
*/
edit.url = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warranty: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { warranty: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            warranty: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warranty: typeof args.warranty === 'object'
        ? args.warranty.id
        : args.warranty,
    }

    return edit.definition.url
            .replace('{warranty}', parsedArgs.warranty.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::edit
* @see app/Http/Controllers/MasterData/WarrantyController.php:63
* @route '/settings/master-data/warranties/{warranty}/edit'
*/
edit.get = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::edit
* @see app/Http/Controllers/MasterData/WarrantyController.php:63
* @route '/settings/master-data/warranties/{warranty}/edit'
*/
edit.head = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::update
* @see app/Http/Controllers/MasterData/WarrantyController.php:72
* @route '/settings/master-data/warranties/{warranty}'
*/
export const update = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/warranties/{warranty}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::update
* @see app/Http/Controllers/MasterData/WarrantyController.php:72
* @route '/settings/master-data/warranties/{warranty}'
*/
update.url = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warranty: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { warranty: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            warranty: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warranty: typeof args.warranty === 'object'
        ? args.warranty.id
        : args.warranty,
    }

    return update.definition.url
            .replace('{warranty}', parsedArgs.warranty.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::update
* @see app/Http/Controllers/MasterData/WarrantyController.php:72
* @route '/settings/master-data/warranties/{warranty}'
*/
update.put = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::update
* @see app/Http/Controllers/MasterData/WarrantyController.php:72
* @route '/settings/master-data/warranties/{warranty}'
*/
update.patch = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::destroy
* @see app/Http/Controllers/MasterData/WarrantyController.php:83
* @route '/settings/master-data/warranties/{warranty}'
*/
export const destroy = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/warranties/{warranty}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::destroy
* @see app/Http/Controllers/MasterData/WarrantyController.php:83
* @route '/settings/master-data/warranties/{warranty}'
*/
destroy.url = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warranty: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { warranty: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            warranty: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warranty: typeof args.warranty === 'object'
        ? args.warranty.id
        : args.warranty,
    }

    return destroy.definition.url
            .replace('{warranty}', parsedArgs.warranty.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\WarrantyController::destroy
* @see app/Http/Controllers/MasterData/WarrantyController.php:83
* @route '/settings/master-data/warranties/{warranty}'
*/
destroy.delete = (args: { warranty: number | { id: number } } | [warranty: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const warranties = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default warranties