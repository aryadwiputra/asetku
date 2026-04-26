import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
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
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
my.url = (options?: RouteQueryOptions) => {
    return my.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
my.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
my.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: my.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
const myForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
myForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::my
* @see app/Http/Controllers/WorkOrderController.php:110
* @route '/work-orders/my'
*/
myForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

my.form = myForm

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:198
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
* @see app/Http/Controllers/WorkOrderController.php:198
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
* @see app/Http/Controllers/WorkOrderController.php:198
* @route '/work-orders/by-token/{token}'
*/
byToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:198
* @route '/work-orders/by-token/{token}'
*/
byToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:198
* @route '/work-orders/by-token/{token}'
*/
const byTokenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:198
* @route '/work-orders/by-token/{token}'
*/
byTokenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::byToken
* @see app/Http/Controllers/WorkOrderController.php:198
* @route '/work-orders/by-token/{token}'
*/
byTokenForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byToken.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

byToken.form = byTokenForm

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
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::index
* @see app/Http/Controllers/WorkOrderController.php:25
* @route '/work-orders'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
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
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::create
* @see app/Http/Controllers/WorkOrderController.php:137
* @route '/work-orders/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:174
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
* @see app/Http/Controllers/WorkOrderController.php:174
* @route '/work-orders'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:174
* @route '/work-orders'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:174
* @route '/work-orders'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderController::store
* @see app/Http/Controllers/WorkOrderController.php:174
* @route '/work-orders'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:210
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
* @see app/Http/Controllers/WorkOrderController.php:210
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
* @see app/Http/Controllers/WorkOrderController.php:210
* @route '/work-orders/{workOrder}'
*/
show.get = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:210
* @route '/work-orders/{workOrder}'
*/
show.head = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:210
* @route '/work-orders/{workOrder}'
*/
const showForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:210
* @route '/work-orders/{workOrder}'
*/
showForm.get = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::show
* @see app/Http/Controllers/WorkOrderController.php:210
* @route '/work-orders/{workOrder}'
*/
showForm.head = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

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
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
const editForm = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
editForm.get = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkOrderController::edit
* @see app/Http/Controllers/WorkOrderController.php:0
* @route '/work-orders/{workOrder}/edit'
*/
editForm.head = (args: { workOrder: string | number } | [workOrder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:256
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
* @see app/Http/Controllers/WorkOrderController.php:256
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
* @see app/Http/Controllers/WorkOrderController.php:256
* @route '/work-orders/{workOrder}'
*/
update.put = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:256
* @route '/work-orders/{workOrder}'
*/
update.patch = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:256
* @route '/work-orders/{workOrder}'
*/
const updateForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:256
* @route '/work-orders/{workOrder}'
*/
updateForm.put = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderController::update
* @see app/Http/Controllers/WorkOrderController.php:256
* @route '/work-orders/{workOrder}'
*/
updateForm.patch = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const WorkOrderController = { my, byToken, index, create, store, show, edit, update }

export default WorkOrderController