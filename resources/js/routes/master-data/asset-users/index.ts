import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::index
* @see app/Http/Controllers/MasterData/AssetUserController.php:17
* @route '/settings/master-data/asset-users'
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
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-users/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::create
* @see app/Http/Controllers/MasterData/AssetUserController.php:50
* @route '/settings/master-data/asset-users/create'
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
* @see \App\Http\Controllers\MasterData\AssetUserController::store
* @see app/Http/Controllers/MasterData/AssetUserController.php:63
* @route '/settings/master-data/asset-users'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/asset-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::store
* @see app/Http/Controllers/MasterData/AssetUserController.php:63
* @route '/settings/master-data/asset-users'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::store
* @see app/Http/Controllers/MasterData/AssetUserController.php:63
* @route '/settings/master-data/asset-users'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::store
* @see app/Http/Controllers/MasterData/AssetUserController.php:63
* @route '/settings/master-data/asset-users'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::store
* @see app/Http/Controllers/MasterData/AssetUserController.php:63
* @route '/settings/master-data/asset-users'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
export const edit = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-users/{asset_user}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
edit.url = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_user: typeof args.asset_user === 'object'
        ? args.asset_user.id
        : args.asset_user,
    }

    return edit.definition.url
            .replace('{asset_user}', parsedArgs.asset_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
edit.get = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
edit.head = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
const editForm = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
editForm.get = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::edit
* @see app/Http/Controllers/MasterData/AssetUserController.php:74
* @route '/settings/master-data/asset-users/{asset_user}/edit'
*/
editForm.head = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
export const update = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/asset-users/{asset_user}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
update.url = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_user: typeof args.asset_user === 'object'
        ? args.asset_user.id
        : args.asset_user,
    }

    return update.definition.url
            .replace('{asset_user}', parsedArgs.asset_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
update.put = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
update.patch = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
const updateForm = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
updateForm.put = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::update
* @see app/Http/Controllers/MasterData/AssetUserController.php:88
* @route '/settings/master-data/asset-users/{asset_user}'
*/
updateForm.patch = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetUserController::destroy
* @see app/Http/Controllers/MasterData/AssetUserController.php:99
* @route '/settings/master-data/asset-users/{asset_user}'
*/
export const destroy = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/asset-users/{asset_user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::destroy
* @see app/Http/Controllers/MasterData/AssetUserController.php:99
* @route '/settings/master-data/asset-users/{asset_user}'
*/
destroy.url = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_user: typeof args.asset_user === 'object'
        ? args.asset_user.id
        : args.asset_user,
    }

    return destroy.definition.url
            .replace('{asset_user}', parsedArgs.asset_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::destroy
* @see app/Http/Controllers/MasterData/AssetUserController.php:99
* @route '/settings/master-data/asset-users/{asset_user}'
*/
destroy.delete = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::destroy
* @see app/Http/Controllers/MasterData/AssetUserController.php:99
* @route '/settings/master-data/asset-users/{asset_user}'
*/
const destroyForm = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetUserController::destroy
* @see app/Http/Controllers/MasterData/AssetUserController.php:99
* @route '/settings/master-data/asset-users/{asset_user}'
*/
destroyForm.delete = (args: { asset_user: number | { id: number } } | [asset_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const assetUsers = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default assetUsers