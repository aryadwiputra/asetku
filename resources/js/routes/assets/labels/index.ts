import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/assets-labels/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetLabelController::print
* @see app/Http/Controllers/AssetLabelController.php:12
* @route '/assets-labels/print'
*/
printForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

print.form = printForm

const labels = {
    print: Object.assign(print, print),
}

export default labels