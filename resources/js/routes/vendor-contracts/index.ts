import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import documents from './documents'
/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vendor-contracts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::index
* @see app/Http/Controllers/VendorContractController.php:23
* @route '/vendor-contracts'
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
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/vendor-contracts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::create
* @see app/Http/Controllers/VendorContractController.php:85
* @route '/vendor-contracts/create'
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
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:92
* @route '/vendor-contracts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vendor-contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:92
* @route '/vendor-contracts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:92
* @route '/vendor-contracts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:92
* @route '/vendor-contracts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:92
* @route '/vendor-contracts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
export const show = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/vendor-contracts/{vendor_contract}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
show.url = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{vendor_contract}', parsedArgs.vendor_contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
show.get = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
show.head = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
const showForm = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
showForm.get = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::show
* @see app/Http/Controllers/VendorContractController.php:115
* @route '/vendor-contracts/{vendor_contract}'
*/
showForm.head = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
export const edit = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/vendor-contracts/{vendor_contract}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
edit.url = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
edit.get = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
edit.head = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
const editForm = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
editForm.get = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VendorContractController::edit
* @see app/Http/Controllers/VendorContractController.php:174
* @route '/vendor-contracts/{vendor_contract}/edit'
*/
editForm.head = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
export const update = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/vendor-contracts/{vendor_contract}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
update.url = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
update.put = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
update.patch = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
const updateForm = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
updateForm.put = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::update
* @see app/Http/Controllers/VendorContractController.php:188
* @route '/vendor-contracts/{vendor_contract}'
*/
updateForm.patch = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\VendorContractController::destroy
* @see app/Http/Controllers/VendorContractController.php:209
* @route '/vendor-contracts/{vendor_contract}'
*/
export const destroy = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/vendor-contracts/{vendor_contract}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VendorContractController::destroy
* @see app/Http/Controllers/VendorContractController.php:209
* @route '/vendor-contracts/{vendor_contract}'
*/
destroy.url = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\VendorContractController::destroy
* @see app/Http/Controllers/VendorContractController.php:209
* @route '/vendor-contracts/{vendor_contract}'
*/
destroy.delete = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\VendorContractController::destroy
* @see app/Http/Controllers/VendorContractController.php:209
* @route '/vendor-contracts/{vendor_contract}'
*/
const destroyForm = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::destroy
* @see app/Http/Controllers/VendorContractController.php:209
* @route '/vendor-contracts/{vendor_contract}'
*/
destroyForm.delete = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\VendorContractController::renew
* @see app/Http/Controllers/VendorContractController.php:227
* @route '/vendor-contracts/{vendorContract}/renew'
*/
export const renew = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/vendor-contracts/{vendorContract}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VendorContractController::renew
* @see app/Http/Controllers/VendorContractController.php:227
* @route '/vendor-contracts/{vendorContract}/renew'
*/
renew.url = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendorContract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { vendorContract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            vendorContract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        vendorContract: typeof args.vendorContract === 'object'
        ? args.vendorContract.id
        : args.vendorContract,
    }

    return renew.definition.url
            .replace('{vendorContract}', parsedArgs.vendorContract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::renew
* @see app/Http/Controllers/VendorContractController.php:227
* @route '/vendor-contracts/{vendorContract}/renew'
*/
renew.post = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::renew
* @see app/Http/Controllers/VendorContractController.php:227
* @route '/vendor-contracts/{vendorContract}/renew'
*/
const renewForm = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: renew.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::renew
* @see app/Http/Controllers/VendorContractController.php:227
* @route '/vendor-contracts/{vendorContract}/renew'
*/
renewForm.post = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: renew.url(args, options),
    method: 'post',
})

renew.form = renewForm

const vendorContracts = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    renew: Object.assign(renew, renew),
    documents: Object.assign(documents, documents),
}

export default vendorContracts