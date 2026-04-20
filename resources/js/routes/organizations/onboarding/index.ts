import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import profile937a89 from './profile'
import planB10180 from './plan'
import locale4d6822 from './locale'
import assetCodeE6d987 from './asset-code'
import importMethod7367d2 from './import'
/**
* @see \App\Http\Controllers\OrganizationOnboardingController::profile
* @see app/Http/Controllers/OrganizationOnboardingController.php:22
* @route '/organizations/onboarding/profile'
*/
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/organizations/onboarding/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::profile
* @see app/Http/Controllers/OrganizationOnboardingController.php:22
* @route '/organizations/onboarding/profile'
*/
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::profile
* @see app/Http/Controllers/OrganizationOnboardingController.php:22
* @route '/organizations/onboarding/profile'
*/
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::profile
* @see app/Http/Controllers/OrganizationOnboardingController.php:22
* @route '/organizations/onboarding/profile'
*/
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::plan
* @see app/Http/Controllers/OrganizationOnboardingController.php:101
* @route '/organizations/onboarding/plan'
*/
export const plan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plan.url(options),
    method: 'get',
})

plan.definition = {
    methods: ["get","head"],
    url: '/organizations/onboarding/plan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::plan
* @see app/Http/Controllers/OrganizationOnboardingController.php:101
* @route '/organizations/onboarding/plan'
*/
plan.url = (options?: RouteQueryOptions) => {
    return plan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::plan
* @see app/Http/Controllers/OrganizationOnboardingController.php:101
* @route '/organizations/onboarding/plan'
*/
plan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plan.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::plan
* @see app/Http/Controllers/OrganizationOnboardingController.php:101
* @route '/organizations/onboarding/plan'
*/
plan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plan.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::locale
* @see app/Http/Controllers/OrganizationOnboardingController.php:130
* @route '/organizations/onboarding/locale'
*/
export const locale = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: locale.url(options),
    method: 'get',
})

locale.definition = {
    methods: ["get","head"],
    url: '/organizations/onboarding/locale',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::locale
* @see app/Http/Controllers/OrganizationOnboardingController.php:130
* @route '/organizations/onboarding/locale'
*/
locale.url = (options?: RouteQueryOptions) => {
    return locale.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::locale
* @see app/Http/Controllers/OrganizationOnboardingController.php:130
* @route '/organizations/onboarding/locale'
*/
locale.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: locale.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::locale
* @see app/Http/Controllers/OrganizationOnboardingController.php:130
* @route '/organizations/onboarding/locale'
*/
locale.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: locale.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::assetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:160
* @route '/organizations/onboarding/asset-code'
*/
export const assetCode = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assetCode.url(options),
    method: 'get',
})

assetCode.definition = {
    methods: ["get","head"],
    url: '/organizations/onboarding/asset-code',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::assetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:160
* @route '/organizations/onboarding/asset-code'
*/
assetCode.url = (options?: RouteQueryOptions) => {
    return assetCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::assetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:160
* @route '/organizations/onboarding/asset-code'
*/
assetCode.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assetCode.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::assetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:160
* @route '/organizations/onboarding/asset-code'
*/
assetCode.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assetCode.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::importMethod
* @see app/Http/Controllers/OrganizationOnboardingController.php:189
* @route '/organizations/onboarding/import'
*/
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

importMethod.definition = {
    methods: ["get","head"],
    url: '/organizations/onboarding/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::importMethod
* @see app/Http/Controllers/OrganizationOnboardingController.php:189
* @route '/organizations/onboarding/import'
*/
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::importMethod
* @see app/Http/Controllers/OrganizationOnboardingController.php:189
* @route '/organizations/onboarding/import'
*/
importMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::importMethod
* @see app/Http/Controllers/OrganizationOnboardingController.php:189
* @route '/organizations/onboarding/import'
*/
importMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importMethod.url(options),
    method: 'head',
})

const onboarding = {
    profile: Object.assign(profile, profile937a89),
    plan: Object.assign(plan, planB10180),
    locale: Object.assign(locale, locale4d6822),
    assetCode: Object.assign(assetCode, assetCodeE6d987),
    import: Object.assign(importMethod, importMethod7367d2),
}

export default onboarding