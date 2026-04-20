import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
export const edit = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
edit.get = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::edit
* @see app/Http/Controllers/MasterData/VendorContractController.php:64
* @route '/settings/master-data/vendor-contracts/{vendor_contract}/edit'
*/
edit.head = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
export const update = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
update.put = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::update
* @see app/Http/Controllers/MasterData/VendorContractController.php:73
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
update.patch = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
export const destroy = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
* @see \App\Http\Controllers\MasterData\VendorContractController::destroy
* @see app/Http/Controllers/MasterData/VendorContractController.php:84
* @route '/settings/master-data/vendor-contracts/{vendor_contract}'
*/
destroy.delete = (args: { vendor_contract: number | { id: number } } | [vendor_contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const VendorContractController = { index, create, store, edit, update, destroy }

export default VendorContractController