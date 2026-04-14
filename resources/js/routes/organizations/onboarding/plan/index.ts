import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:106
* @route '/organizations/onboarding/plan'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/plan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:106
* @route '/organizations/onboarding/plan'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:106
* @route '/organizations/onboarding/plan'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:106
* @route '/organizations/onboarding/plan'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::update
* @see app/Http/Controllers/OrganizationOnboardingController.php:106
* @route '/organizations/onboarding/plan'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const plan = {
    update: Object.assign(update, update),
}

export default plan