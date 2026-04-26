import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const locale = {
    update: Object.assign(update, update),
}

export default locale