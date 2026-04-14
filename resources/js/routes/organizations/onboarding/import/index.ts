import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod