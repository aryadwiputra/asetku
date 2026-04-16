import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::store
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const profile = {
    store: Object.assign(store, store),
}

export default profile