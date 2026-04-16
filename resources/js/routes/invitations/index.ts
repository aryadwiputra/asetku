import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserInvitationController::store
* @see app/Http/Controllers/UserInvitationController.php:14
* @route '/invitations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserInvitationController::store
* @see app/Http/Controllers/UserInvitationController.php:14
* @route '/invitations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserInvitationController::store
* @see app/Http/Controllers/UserInvitationController.php:14
* @route '/invitations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const invitations = {
    store: Object.assign(store, store),
}

export default invitations