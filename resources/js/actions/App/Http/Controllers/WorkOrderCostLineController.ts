import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

const WorkOrderCostLineController = { store, update, destroy }

export default WorkOrderCostLineController