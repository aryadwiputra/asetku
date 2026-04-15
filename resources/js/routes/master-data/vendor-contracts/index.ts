import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendor-contracts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::index
* @see app/Http/Controllers/MasterData/VendorContractController.php:16
* @route '/settings/master-data/vendor-contracts'
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
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendor-contracts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::create
* @see app/Http/Controllers/MasterData/VendorContractController.php:46
* @route '/settings/master-data/vendor-contracts/create'
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
* @see \App\Http\Controllers\MasterData\VendorContractController::store
* @see app/Http/Controllers/MasterData/VendorContractController.php:53
* @route '/settings/master-data/vendor-contracts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/vendor-contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::store
* @see app/Http/Controllers/MasterData/VendorContractController.php:53
* @route '/settings/master-data/vendor-contracts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::store
* @see app/Http/Controllers/MasterData/VendorContractController.php:53
* @route '/settings/master-data/vendor-contracts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::store
* @see app/Http/Controllers/MasterData/VendorContractController.php:53
* @route '/settings/master-data/vendor-contracts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::store
* @see app/Http/Controllers/MasterData/VendorContractController.php:53
* @route '/settings/master-data/vendor-contracts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
export const edit = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/vendor-contracts/{vendor_contract}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
edit.url = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor_contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor_contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor_contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor_contract: typeof args.vendor_contract === 'object'
        ? args.vendor_contract.id
        : args.vendor_contract,
    }

    return edit.definition.url
            .replace('{vendor_contract}', parsedArgs.vendor_contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
edit.get = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
edit.head = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
const editForm = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
editForm.get = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
editForm.head = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
export const update = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/vendor-contracts/{vendor_contract}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
update.url = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor_contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor_contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor_contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor_contract: typeof args.vendor_contract === 'object'
        ? args.vendor_contract.id
        : args.vendor_contract,
    }

    return update.definition.url
            .replace('{vendor_contract}', parsedArgs.vendor_contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
update.put = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
update.patch = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
const updateForm = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
updateForm.put = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
updateForm.patch = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
export const destroy = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/vendor-contracts/{vendor_contract}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
destroy.url = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor_contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendor_contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendor_contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendor_contract: typeof args.vendor_contract === 'object'
        ? args.vendor_contract.id
        : args.vendor_contract,
    }

    return destroy.definition.url
            .replace('{vendor_contract}', parsedArgs.vendor_contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
destroy.delete = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
const destroyForm = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
destroyForm.delete = (args: { vendor_contract: string | number | { id: string | number } } | [vendor_contract: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const vendorContracts = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default vendorContracts