import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import onboarding from './onboarding'
/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationController::index
* @see app/Http/Controllers/OrganizationController.php:11
* @route '/organizations'
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
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
export const switchMethod = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
switchMethod.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        organization: typeof args.organization === 'object'
        ? args.organization.id
        : args.organization,
    }

    return switchMethod.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
switchMethod.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
const switchMethodForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
switchMethodForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.form = switchMethodForm

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
export const importTemplate = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importTemplate.url(args, options),
    method: 'get',
})

importTemplate.definition = {
    methods: ["get","head"],
    url: '/organizations/import-template/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
importTemplate.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return importTemplate.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
importTemplate.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importTemplate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
importTemplate.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importTemplate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
const importTemplateForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importTemplate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
importTemplateForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importTemplate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationImportTemplateController::__invoke
* @see app/Http/Controllers/OrganizationImportTemplateController.php:16
* @route '/organizations/import-template/{type}'
*/
importTemplateForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importTemplate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

importTemplate.form = importTemplateForm

const organizations = {
    index: Object.assign(index, index),
    switch: Object.assign(switchMethod, switchMethod),
    importTemplate: Object.assign(importTemplate, importTemplate),
    onboarding: Object.assign(onboarding, onboarding),
}

export default organizations