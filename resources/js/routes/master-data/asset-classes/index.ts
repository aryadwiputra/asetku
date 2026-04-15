import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::index
* @see app/Http/Controllers/MasterData/AssetClassController.php:16
* @route '/settings/master-data/asset-classes'
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
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-classes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::create
* @see app/Http/Controllers/MasterData/AssetClassController.php:46
* @route '/settings/master-data/asset-classes/create'
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
* @see \App\Http\Controllers\MasterData\AssetClassController::store
* @see app/Http/Controllers/MasterData/AssetClassController.php:53
* @route '/settings/master-data/asset-classes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/asset-classes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::store
* @see app/Http/Controllers/MasterData/AssetClassController.php:53
* @route '/settings/master-data/asset-classes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::store
* @see app/Http/Controllers/MasterData/AssetClassController.php:53
* @route '/settings/master-data/asset-classes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::store
* @see app/Http/Controllers/MasterData/AssetClassController.php:53
* @route '/settings/master-data/asset-classes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::store
* @see app/Http/Controllers/MasterData/AssetClassController.php:53
* @route '/settings/master-data/asset-classes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
export const edit = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-classes/{asset_class}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
edit.url = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_class: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_class: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_class: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_class: typeof args.asset_class === 'object'
        ? args.asset_class.id
        : args.asset_class,
    }

    return edit.definition.url
            .replace('{asset_class}', parsedArgs.asset_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
edit.get = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
edit.head = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
const editForm = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
editForm.get = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::edit
* @see app/Http/Controllers/MasterData/AssetClassController.php:64
* @route '/settings/master-data/asset-classes/{asset_class}/edit'
*/
editForm.head = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
export const update = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/asset-classes/{asset_class}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
update.url = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_class: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_class: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_class: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_class: typeof args.asset_class === 'object'
        ? args.asset_class.id
        : args.asset_class,
    }

    return update.definition.url
            .replace('{asset_class}', parsedArgs.asset_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
update.put = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
update.patch = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
const updateForm = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
updateForm.put = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::update
* @see app/Http/Controllers/MasterData/AssetClassController.php:73
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
updateForm.patch = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetClassController::destroy
* @see app/Http/Controllers/MasterData/AssetClassController.php:84
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
export const destroy = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/asset-classes/{asset_class}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::destroy
* @see app/Http/Controllers/MasterData/AssetClassController.php:84
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
destroy.url = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_class: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_class: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_class: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_class: typeof args.asset_class === 'object'
        ? args.asset_class.id
        : args.asset_class,
    }

    return destroy.definition.url
            .replace('{asset_class}', parsedArgs.asset_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::destroy
* @see app/Http/Controllers/MasterData/AssetClassController.php:84
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
destroy.delete = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::destroy
* @see app/Http/Controllers/MasterData/AssetClassController.php:84
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
const destroyForm = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetClassController::destroy
* @see app/Http/Controllers/MasterData/AssetClassController.php:84
* @route '/settings/master-data/asset-classes/{asset_class}'
*/
destroyForm.delete = (args: { asset_class: string | number | { id: string | number } } | [asset_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const assetClasses = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default assetClasses