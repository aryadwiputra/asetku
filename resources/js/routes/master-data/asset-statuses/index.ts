import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::index
* @see app/Http/Controllers/MasterData/AssetStatusController.php:16
* @route '/settings/master-data/asset-statuses'
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
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-statuses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::create
* @see app/Http/Controllers/MasterData/AssetStatusController.php:46
* @route '/settings/master-data/asset-statuses/create'
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
* @see \App\Http\Controllers\MasterData\AssetStatusController::store
* @see app/Http/Controllers/MasterData/AssetStatusController.php:53
* @route '/settings/master-data/asset-statuses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/asset-statuses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::store
* @see app/Http/Controllers/MasterData/AssetStatusController.php:53
* @route '/settings/master-data/asset-statuses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::store
* @see app/Http/Controllers/MasterData/AssetStatusController.php:53
* @route '/settings/master-data/asset-statuses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::store
* @see app/Http/Controllers/MasterData/AssetStatusController.php:53
* @route '/settings/master-data/asset-statuses'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::store
* @see app/Http/Controllers/MasterData/AssetStatusController.php:53
* @route '/settings/master-data/asset-statuses'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
export const edit = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-statuses/{asset_status}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
edit.url = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_status: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_status: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_status: typeof args.asset_status === 'object'
        ? args.asset_status.id
        : args.asset_status,
    }

    return edit.definition.url
            .replace('{asset_status}', parsedArgs.asset_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
edit.get = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
edit.head = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
const editForm = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
editForm.get = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::edit
* @see app/Http/Controllers/MasterData/AssetStatusController.php:64
* @route '/settings/master-data/asset-statuses/{asset_status}/edit'
*/
editForm.head = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
export const update = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/asset-statuses/{asset_status}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
update.url = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_status: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_status: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_status: typeof args.asset_status === 'object'
        ? args.asset_status.id
        : args.asset_status,
    }

    return update.definition.url
            .replace('{asset_status}', parsedArgs.asset_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
update.put = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
update.patch = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
const updateForm = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
updateForm.put = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::update
* @see app/Http/Controllers/MasterData/AssetStatusController.php:73
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
updateForm.patch = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetStatusController::destroy
* @see app/Http/Controllers/MasterData/AssetStatusController.php:84
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
export const destroy = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/asset-statuses/{asset_status}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::destroy
* @see app/Http/Controllers/MasterData/AssetStatusController.php:84
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
destroy.url = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_status: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_status: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_status: typeof args.asset_status === 'object'
        ? args.asset_status.id
        : args.asset_status,
    }

    return destroy.definition.url
            .replace('{asset_status}', parsedArgs.asset_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::destroy
* @see app/Http/Controllers/MasterData/AssetStatusController.php:84
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
destroy.delete = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::destroy
* @see app/Http/Controllers/MasterData/AssetStatusController.php:84
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
const destroyForm = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetStatusController::destroy
* @see app/Http/Controllers/MasterData/AssetStatusController.php:84
* @route '/settings/master-data/asset-statuses/{asset_status}'
*/
destroyForm.delete = (args: { asset_status: number | { id: number } } | [asset_status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const assetStatuses = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default assetStatuses