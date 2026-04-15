import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::index
* @see app/Http/Controllers/MasterData/UnitController.php:16
* @route '/settings/master-data/units'
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
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::create
* @see app/Http/Controllers/MasterData/UnitController.php:46
* @route '/settings/master-data/units/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

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
* @see \App\Http\Controllers\MasterData\UnitController::store
* @see app/Http/Controllers/MasterData/UnitController.php:53
* @route '/settings/master-data/units'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::store
* @see app/Http/Controllers/MasterData/UnitController.php:53
* @route '/settings/master-data/units'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
export const edit = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
edit.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
edit.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
edit.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
const editForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
editForm.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::edit
* @see app/Http/Controllers/MasterData/UnitController.php:64
* @route '/settings/master-data/units/{unit}/edit'
*/
editForm.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
export const update = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.put = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
update.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
const updateForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
updateForm.put = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::update
* @see app/Http/Controllers/MasterData/UnitController.php:73
* @route '/settings/master-data/units/{unit}'
*/
updateForm.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
export const destroy = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
const destroyForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\UnitController::destroy
* @see app/Http/Controllers/MasterData/UnitController.php:84
* @route '/settings/master-data/units/{unit}'
*/
destroyForm.delete = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const units = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default units