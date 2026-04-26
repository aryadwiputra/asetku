import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/asset-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

const assetCode = {
    update: Object.assign(update, update),
}

export default assetCode