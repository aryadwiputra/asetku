import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
const OrganizationImportTemplateController = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrganizationImportTemplateController.url(args, options),
    method: 'get',
})

OrganizationImportTemplateController.definition = {
    methods: ["get","head"],
    url: '/organizations/import-template/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
OrganizationImportTemplateController.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return OrganizationImportTemplateController.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
OrganizationImportTemplateController.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrganizationImportTemplateController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
OrganizationImportTemplateController.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OrganizationImportTemplateController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
const OrganizationImportTemplateControllerForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrganizationImportTemplateController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
OrganizationImportTemplateControllerForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrganizationImportTemplateController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
OrganizationImportTemplateControllerForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrganizationImportTemplateController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

OrganizationImportTemplateController.form = OrganizationImportTemplateControllerForm

export default OrganizationImportTemplateController