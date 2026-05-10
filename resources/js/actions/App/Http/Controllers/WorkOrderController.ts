import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:112
* @route '/work-orders/my'
*/
export const my = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

my.definition = {
    methods: ["get","head"],
    url: '/work-orders/my',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:112
* @route '/work-orders/my'
*/
my.url = (options?: RouteQueryOptions) => {
    return my.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:112
* @route '/work-orders/my'
*/
my.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:112
* @route '/work-orders/my'
*/
my.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: my.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:201
* @route '/work-orders/by-token/{token}'
*/
export const byToken = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

byToken.definition = {
    methods: ["get","head"],
    url: '/work-orders/by-token/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:201
* @route '/work-orders/by-token/{token}'
*/
byToken.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return byToken.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:201
* @route '/work-orders/by-token/{token}'
*/
byToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:201
* @route '/work-orders/by-token/{token}'
*/
byToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/work-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:140
* @route '/work-orders/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/work-orders/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:140
* @route '/work-orders/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:140
* @route '/work-orders/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:140
* @route '/work-orders/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:177
* @route '/work-orders'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:177
* @route '/work-orders'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:177
* @route '/work-orders'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:213
* @route '/work-orders/{workOrder}'
*/
export const show = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/work-orders/{workOrder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:213
* @route '/work-orders/{workOrder}'
*/
show.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
    }

    return show.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:213
* @route '/work-orders/{workOrder}'
*/
show.get = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:213
* @route '/work-orders/{workOrder}'
*/
show.head = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
export const edit = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/work-orders/{workOrder}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
edit.url = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: args.workOrder,
    }

    return edit.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
edit.get = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
edit.head = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:279
* @route '/work-orders/{workOrder}'
*/
export const update = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/work-orders/{workOrder}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:279
* @route '/work-orders/{workOrder}'
*/
update.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
    }

    return update.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:279
* @route '/work-orders/{workOrder}'
*/
update.put = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:279
* @route '/work-orders/{workOrder}'
*/
update.patch = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

const WorkOrderController = { my, byToken, index, create, store, show, edit, update }

export default WorkOrderController