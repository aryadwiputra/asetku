import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\VendorContractController::storeDocument
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
export const storeDocument = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

storeDocument.definition = {
    methods: ["post"],
    url: '/vendor-contracts/{vendorContract}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VendorContractController::storeDocument
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
storeDocument.url = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeDocument.definition.url
            .replace('{vendorContract}', parsedArgs.vendorContract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::storeDocument
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
storeDocument.post = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

const VendorContractController = { index, create, store, show, edit, update, destroy, renew, storeDocument }

export default VendorContractController