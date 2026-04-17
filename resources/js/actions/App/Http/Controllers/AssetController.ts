import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/assets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::index
* @see app/Http/Controllers/AssetController.php:37
* @route '/assets'
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
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/assets/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::create
* @see app/Http/Controllers/AssetController.php:69
* @route '/assets/create'
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
* @see \App\Http\Controllers\AssetController::store
* @see app/Http/Controllers/AssetController.php:76
* @route '/assets'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetController::store
* @see app/Http/Controllers/AssetController.php:76
* @route '/assets'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::store
* @see app/Http/Controllers/AssetController.php:76
* @route '/assets'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetController::store
* @see app/Http/Controllers/AssetController.php:76
* @route '/assets'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetController::store
* @see app/Http/Controllers/AssetController.php:76
* @route '/assets'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
export const show = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
show.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return show.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
show.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
show.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
const showForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
showForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::show
* @see app/Http/Controllers/AssetController.php:123
* @route '/assets/{asset}'
*/
showForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
export const edit = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
edit.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return edit.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
edit.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
edit.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
const editForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
editForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetController::edit
* @see app/Http/Controllers/AssetController.php:194
* @route '/assets/{asset}/edit'
*/
editForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
export const update = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/assets/{asset}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
update.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return update.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
update.put = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
update.patch = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
const updateForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
updateForm.put = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetController::update
* @see app/Http/Controllers/AssetController.php:212
* @route '/assets/{asset}'
*/
updateForm.patch = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AssetController::destroy
* @see app/Http/Controllers/AssetController.php:258
* @route '/assets/{asset}'
*/
export const destroy = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assets/{asset}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetController::destroy
* @see app/Http/Controllers/AssetController.php:258
* @route '/assets/{asset}'
*/
destroy.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return destroy.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::destroy
* @see app/Http/Controllers/AssetController.php:258
* @route '/assets/{asset}'
*/
destroy.delete = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AssetController::destroy
* @see app/Http/Controllers/AssetController.php:258
* @route '/assets/{asset}'
*/
const destroyForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetController::destroy
* @see app/Http/Controllers/AssetController.php:258
* @route '/assets/{asset}'
*/
destroyForm.delete = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AssetController = { index, create, store, show, edit, update, destroy }

export default AssetController