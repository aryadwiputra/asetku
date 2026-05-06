import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
export const store = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vendor-contracts/{vendorContract}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
store.url = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{vendorContract}', parsedArgs.vendorContract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
store.post = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
const storeForm = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VendorContractController::store
* @see app/Http/Controllers/VendorContractController.php:278
* @route '/vendor-contracts/{vendorContract}/documents'
*/
storeForm.post = (args: { vendorContract: number | { id: number } } | [vendorContract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const documents = {
    store: Object.assign(store, store),
}

export default documents