import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-conditions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::index
* @see app/Http/Controllers/MasterData/AssetConditionController.php:16
* @route '/settings/master-data/asset-conditions'
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
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-conditions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::create
* @see app/Http/Controllers/MasterData/AssetConditionController.php:46
* @route '/settings/master-data/asset-conditions/create'
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
* @see \App\Http\Controllers\MasterData\AssetConditionController::store
* @see app/Http/Controllers/MasterData/AssetConditionController.php:53
* @route '/settings/master-data/asset-conditions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/asset-conditions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::store
* @see app/Http/Controllers/MasterData/AssetConditionController.php:53
* @route '/settings/master-data/asset-conditions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::store
* @see app/Http/Controllers/MasterData/AssetConditionController.php:53
* @route '/settings/master-data/asset-conditions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::store
* @see app/Http/Controllers/MasterData/AssetConditionController.php:53
* @route '/settings/master-data/asset-conditions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::store
* @see app/Http/Controllers/MasterData/AssetConditionController.php:53
* @route '/settings/master-data/asset-conditions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
export const edit = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/asset-conditions/{asset_condition}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
edit.url = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_condition: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_condition: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_condition: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_condition: typeof args.asset_condition === 'object'
        ? args.asset_condition.id
        : args.asset_condition,
    }

    return edit.definition.url
            .replace('{asset_condition}', parsedArgs.asset_condition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
edit.get = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
edit.head = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
const editForm = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
editForm.get = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::edit
* @see app/Http/Controllers/MasterData/AssetConditionController.php:64
* @route '/settings/master-data/asset-conditions/{asset_condition}/edit'
*/
editForm.head = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
export const update = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/asset-conditions/{asset_condition}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
update.url = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_condition: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_condition: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_condition: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_condition: typeof args.asset_condition === 'object'
        ? args.asset_condition.id
        : args.asset_condition,
    }

    return update.definition.url
            .replace('{asset_condition}', parsedArgs.asset_condition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
update.put = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
update.patch = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
const updateForm = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
updateForm.put = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::update
* @see app/Http/Controllers/MasterData/AssetConditionController.php:73
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
updateForm.patch = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\AssetConditionController::destroy
* @see app/Http/Controllers/MasterData/AssetConditionController.php:84
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
export const destroy = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/asset-conditions/{asset_condition}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::destroy
* @see app/Http/Controllers/MasterData/AssetConditionController.php:84
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
destroy.url = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset_condition: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset_condition: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset_condition: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset_condition: typeof args.asset_condition === 'object'
        ? args.asset_condition.id
        : args.asset_condition,
    }

    return destroy.definition.url
            .replace('{asset_condition}', parsedArgs.asset_condition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::destroy
* @see app/Http/Controllers/MasterData/AssetConditionController.php:84
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
destroy.delete = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::destroy
* @see app/Http/Controllers/MasterData/AssetConditionController.php:84
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
const destroyForm = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\AssetConditionController::destroy
* @see app/Http/Controllers/MasterData/AssetConditionController.php:84
* @route '/settings/master-data/asset-conditions/{asset_condition}'
*/
destroyForm.delete = (args: { asset_condition: number | { id: number } } | [asset_condition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AssetConditionController = { index, create, store, edit, update, destroy }

export default AssetConditionController