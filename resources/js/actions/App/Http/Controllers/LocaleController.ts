import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LocaleController::__invoke
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale'
*/
const LocaleController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LocaleController.url(options),
    method: 'post',
})

LocaleController.definition = {
    methods: ["post"],
    url: '/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocaleController::__invoke
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale'
*/
LocaleController.url = (options?: RouteQueryOptions) => {
    return LocaleController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocaleController::__invoke
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale'
*/
LocaleController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LocaleController.url(options),
    method: 'post',
})

export default LocaleController