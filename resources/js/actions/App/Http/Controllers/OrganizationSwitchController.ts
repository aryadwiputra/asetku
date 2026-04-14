import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
const OrganizationSwitchController = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: OrganizationSwitchController.url(args, options),
    method: 'post',
})

OrganizationSwitchController.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
OrganizationSwitchController.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return OrganizationSwitchController.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
OrganizationSwitchController.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: OrganizationSwitchController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
const OrganizationSwitchControllerForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: OrganizationSwitchController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationSwitchController::__invoke
* @see app/Http/Controllers/OrganizationSwitchController.php:11
* @route '/organizations/{organization}/switch'
*/
OrganizationSwitchControllerForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: OrganizationSwitchController.url(args, options),
    method: 'post',
})

OrganizationSwitchController.form = OrganizationSwitchControllerForm

export default OrganizationSwitchController