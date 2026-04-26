import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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

const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod