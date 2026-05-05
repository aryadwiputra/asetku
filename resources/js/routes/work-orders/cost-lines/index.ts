import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderCostLineController::store
* @see app/Http/Controllers/WorkOrderCostLineController.php:15
* @route '/work-orders/{workOrder}/cost-lines'
*/
export const store = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/cost-lines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::store
* @see app/Http/Controllers/WorkOrderCostLineController.php:15
* @route '/work-orders/{workOrder}/cost-lines'
*/
store.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::store
* @see app/Http/Controllers/WorkOrderCostLineController.php:15
* @route '/work-orders/{workOrder}/cost-lines'
*/
store.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::store
* @see app/Http/Controllers/WorkOrderCostLineController.php:15
* @route '/work-orders/{workOrder}/cost-lines'
*/
const storeForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::store
* @see app/Http/Controllers/WorkOrderCostLineController.php:15
* @route '/work-orders/{workOrder}/cost-lines'
*/
storeForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::update
* @see app/Http/Controllers/WorkOrderCostLineController.php:51
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
export const update = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/work-orders/{workOrder}/cost-lines/{costLine}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::update
* @see app/Http/Controllers/WorkOrderCostLineController.php:51
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
update.url = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
            costLine: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
        costLine: typeof args.costLine === 'object'
        ? args.costLine.id
        : args.costLine,
    }

    return update.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace('{costLine}', parsedArgs.costLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::update
* @see app/Http/Controllers/WorkOrderCostLineController.php:51
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
update.patch = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::update
* @see app/Http/Controllers/WorkOrderCostLineController.php:51
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
const updateForm = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::update
* @see app/Http/Controllers/WorkOrderCostLineController.php:51
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
updateForm.patch = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::destroy
* @see app/Http/Controllers/WorkOrderCostLineController.php:87
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
export const destroy = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/work-orders/{workOrder}/cost-lines/{costLine}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::destroy
* @see app/Http/Controllers/WorkOrderCostLineController.php:87
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
destroy.url = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
            costLine: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
        costLine: typeof args.costLine === 'object'
        ? args.costLine.id
        : args.costLine,
    }

    return destroy.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace('{costLine}', parsedArgs.costLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::destroy
* @see app/Http/Controllers/WorkOrderCostLineController.php:87
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
destroy.delete = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::destroy
* @see app/Http/Controllers/WorkOrderCostLineController.php:87
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
const destroyForm = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderCostLineController::destroy
* @see app/Http/Controllers/WorkOrderCostLineController.php:87
* @route '/work-orders/{workOrder}/cost-lines/{costLine}'
*/
destroyForm.delete = (args: { workOrder: number | { id: number }, costLine: number | { id: number } } | [workOrder: number | { id: number }, costLine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const costLines = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default costLines