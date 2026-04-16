import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\OrganizationOnboardingController::storeProfile
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
export const storeProfile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProfile.url(options),
    method: 'post',
})

storeProfile.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::storeProfile
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
storeProfile.url = (options?: RouteQueryOptions) => {
    return storeProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::storeProfile
* @see app/Http/Controllers/OrganizationOnboardingController.php:29
* @route '/organizations/onboarding/profile'
*/
storeProfile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProfile.url(options),
    method: 'post',
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
* @see \App\Http\Controllers\OrganizationOnboardingController::updatePlan
* @see app/Http/Controllers/OrganizationOnboardingController.php:113
* @route '/organizations/onboarding/plan'
*/
export const updatePlan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePlan.url(options),
    method: 'post',
})

updatePlan.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/plan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updatePlan
* @see app/Http/Controllers/OrganizationOnboardingController.php:113
* @route '/organizations/onboarding/plan'
*/
updatePlan.url = (options?: RouteQueryOptions) => {
    return updatePlan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updatePlan
* @see app/Http/Controllers/OrganizationOnboardingController.php:113
* @route '/organizations/onboarding/plan'
*/
updatePlan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePlan.url(options),
    method: 'post',
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
* @see \App\Http\Controllers\OrganizationOnboardingController::updateLocale
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
export const updateLocale = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLocale.url(options),
    method: 'post',
})

updateLocale.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updateLocale
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
updateLocale.url = (options?: RouteQueryOptions) => {
    return updateLocale.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updateLocale
* @see app/Http/Controllers/OrganizationOnboardingController.php:143
* @route '/organizations/onboarding/locale'
*/
updateLocale.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLocale.url(options),
    method: 'post',
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
* @see \App\Http\Controllers\OrganizationOnboardingController::updateAssetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
export const updateAssetCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateAssetCode.url(options),
    method: 'post',
})

updateAssetCode.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/asset-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updateAssetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
updateAssetCode.url = (options?: RouteQueryOptions) => {
    return updateAssetCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::updateAssetCode
* @see app/Http/Controllers/OrganizationOnboardingController.php:172
* @route '/organizations/onboarding/asset-code'
*/
updateAssetCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateAssetCode.url(options),
    method: 'post',
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

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::storeImport
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
export const storeImport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeImport.url(options),
    method: 'post',
})

storeImport.definition = {
    methods: ["post"],
    url: '/organizations/onboarding/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::storeImport
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
storeImport.url = (options?: RouteQueryOptions) => {
    return storeImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationOnboardingController::storeImport
* @see app/Http/Controllers/OrganizationOnboardingController.php:201
* @route '/organizations/onboarding/import'
*/
storeImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeImport.url(options),
    method: 'post',
})

const OrganizationOnboardingController = { profile, storeProfile, plan, updatePlan, locale, updateLocale, assetCode, updateAssetCode, importMethod, storeImport, import: importMethod }

export default OrganizationOnboardingController