import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/units/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::store
* @see app/Http/Controllers/MasterData/UnitController.php:53
* @route '/settings/master-data/units'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::store
* @see app/Http/Controllers/MasterData/UnitController.php:53
* @route '/settings/master-data/units'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::store
* @see app/Http/Controllers/MasterData/UnitController.php:53
* @route '/settings/master-data/units'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
export const edit = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/units/{unit}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
edit.url = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return edit.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
edit.get = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
edit.head = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
export const update = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/units/{unit}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
update.url = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return update.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
update.put = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
update.patch = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
export const destroy = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/units/{unit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
destroy.url = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return destroy.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
destroy.delete = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const units = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default units