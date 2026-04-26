import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::index
* @see app/Http/Controllers/MasterData/VendorController.php:17
* @route '/settings/master-data/vendors'
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
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendors/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::create
* @see app/Http/Controllers/MasterData/VendorController.php:63
* @route '/settings/master-data/vendors/create'
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
* @see \App\Http\Controllers\MasterData\VendorController::store
* @see app/Http/Controllers/MasterData/VendorController.php:70
* @route '/settings/master-data/vendors'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/vendors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::store
* @see app/Http/Controllers/MasterData/VendorController.php:70
* @route '/settings/master-data/vendors'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::store
* @see app/Http/Controllers/MasterData/VendorController.php:70
* @route '/settings/master-data/vendors'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::store
* @see app/Http/Controllers/MasterData/VendorController.php:70
* @route '/settings/master-data/vendors'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::store
* @see app/Http/Controllers/MasterData/VendorController.php:70
* @route '/settings/master-data/vendors'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
export const edit = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendors/{vendor}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
edit.url = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor: typeof args.vendor === 'object'
        ? args.vendor.id
        : args.vendor,
    }

    return edit.definition.url
            .replace('{vendor}', parsedArgs.vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
edit.get = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
edit.head = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
const editForm = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
editForm.get = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::edit
* @see app/Http/Controllers/MasterData/VendorController.php:84
* @route '/settings/master-data/vendors/{vendor}/edit'
*/
editForm.head = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
export const update = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/vendors/{vendor}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
update.url = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor: typeof args.vendor === 'object'
        ? args.vendor.id
        : args.vendor,
    }

    return update.definition.url
            .replace('{vendor}', parsedArgs.vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
update.put = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
update.patch = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
const updateForm = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
updateForm.put = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::update
* @see app/Http/Controllers/MasterData/VendorController.php:93
* @route '/settings/master-data/vendors/{vendor}'
*/
updateForm.patch = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorController::destroy
* @see app/Http/Controllers/MasterData/VendorController.php:109
* @route '/settings/master-data/vendors/{vendor}'
*/
export const destroy = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/vendors/{vendor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\VendorController::destroy
* @see app/Http/Controllers/MasterData/VendorController.php:109
* @route '/settings/master-data/vendors/{vendor}'
*/
destroy.url = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor: typeof args.vendor === 'object'
        ? args.vendor.id
        : args.vendor,
    }

    return destroy.definition.url
            .replace('{vendor}', parsedArgs.vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorController::destroy
* @see app/Http/Controllers/MasterData/VendorController.php:109
* @route '/settings/master-data/vendors/{vendor}'
*/
destroy.delete = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::destroy
* @see app/Http/Controllers/MasterData/VendorController.php:109
* @route '/settings/master-data/vendors/{vendor}'
*/
const destroyForm = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorController::destroy
* @see app/Http/Controllers/MasterData/VendorController.php:109
* @route '/settings/master-data/vendors/{vendor}'
*/
destroyForm.delete = (args: { vendor: number | { id: number } } | [vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const vendors = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default vendors