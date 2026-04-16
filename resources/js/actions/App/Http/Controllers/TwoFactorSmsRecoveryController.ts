import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TwoFactorSmsRecoveryController::store
* @see app/Http/Controllers/TwoFactorSmsRecoveryController.php:14
* @route '/two-factor/sms-recovery'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/two-factor/sms-recovery',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TwoFactorSmsRecoveryController::store
* @see app/Http/Controllers/TwoFactorSmsRecoveryController.php:14
* @route '/two-factor/sms-recovery'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TwoFactorSmsRecoveryController::store
* @see app/Http/Controllers/TwoFactorSmsRecoveryController.php:14
* @route '/two-factor/sms-recovery'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const TwoFactorSmsRecoveryController = { store }

export default TwoFactorSmsRecoveryController