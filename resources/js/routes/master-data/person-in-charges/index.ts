import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::index
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:16
* @route '/settings/master-data/person-in-charges'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/person-in-charges',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::index
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:16
* @route '/settings/master-data/person-in-charges'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::index
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:16
* @route '/settings/master-data/person-in-charges'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::index
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:16
* @route '/settings/master-data/person-in-charges'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::create
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:47
* @route '/settings/master-data/person-in-charges/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/person-in-charges/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::create
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:47
* @route '/settings/master-data/person-in-charges/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::create
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:47
* @route '/settings/master-data/person-in-charges/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::create
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:47
* @route '/settings/master-data/person-in-charges/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::store
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:54
* @route '/settings/master-data/person-in-charges'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/person-in-charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::store
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:54
* @route '/settings/master-data/person-in-charges'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::store
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:54
* @route '/settings/master-data/person-in-charges'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::edit
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:65
* @route '/settings/master-data/person-in-charges/{person_in_charge}/edit'
*/
export const edit = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/person-in-charges/{person_in_charge}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::edit
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:65
* @route '/settings/master-data/person-in-charges/{person_in_charge}/edit'
*/
edit.url = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { person_in_charge: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { person_in_charge: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            person_in_charge: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        person_in_charge: typeof args.person_in_charge === 'object'
        ? args.person_in_charge.id
        : args.person_in_charge,
    }

    return edit.definition.url
            .replace('{person_in_charge}', parsedArgs.person_in_charge.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::edit
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:65
* @route '/settings/master-data/person-in-charges/{person_in_charge}/edit'
*/
edit.get = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::edit
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:65
* @route '/settings/master-data/person-in-charges/{person_in_charge}/edit'
*/
edit.head = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::update
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:74
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
export const update = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/person-in-charges/{person_in_charge}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::update
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:74
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
update.url = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { person_in_charge: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { person_in_charge: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            person_in_charge: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        person_in_charge: typeof args.person_in_charge === 'object'
        ? args.person_in_charge.id
        : args.person_in_charge,
    }

    return update.definition.url
            .replace('{person_in_charge}', parsedArgs.person_in_charge.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::update
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:74
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
update.put = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::update
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:74
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
update.patch = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::destroy
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:85
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
export const destroy = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/person-in-charges/{person_in_charge}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::destroy
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:85
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
destroy.url = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { person_in_charge: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { person_in_charge: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            person_in_charge: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        person_in_charge: typeof args.person_in_charge === 'object'
        ? args.person_in_charge.id
        : args.person_in_charge,
    }

    return destroy.definition.url
            .replace('{person_in_charge}', parsedArgs.person_in_charge.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\PersonInChargeController::destroy
* @see app/Http/Controllers/MasterData/PersonInChargeController.php:85
* @route '/settings/master-data/person-in-charges/{person_in_charge}'
*/
destroy.delete = (args: { person_in_charge: number | { id: number } } | [person_in_charge: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const personInCharges = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default personInCharges