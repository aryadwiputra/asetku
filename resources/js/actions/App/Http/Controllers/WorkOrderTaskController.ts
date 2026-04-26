import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderTaskController::store
* @see app/Http/Controllers/WorkOrderTaskController.php:13
* @route '/work-orders/{workOrder}/tasks'
*/
export const store = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderTaskController::store
* @see app/Http/Controllers/WorkOrderTaskController.php:13
* @route '/work-orders/{workOrder}/tasks'
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
* @see \App\Http\Controllers\WorkOrderTaskController::store
* @see app/Http/Controllers/WorkOrderTaskController.php:13
* @route '/work-orders/{workOrder}/tasks'
*/
store.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderTaskController::update
* @see app/Http/Controllers/WorkOrderTaskController.php:36
* @route '/work-orders/{workOrder}/tasks/{task}'
*/
export const update = (args: { workOrder: number | { id: number }, task: number | { id: number } } | [workOrder: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/work-orders/{workOrder}/tasks/{task}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WorkOrderTaskController::update
* @see app/Http/Controllers/WorkOrderTaskController.php:36
* @route '/work-orders/{workOrder}/tasks/{task}'
*/
update.url = (args: { workOrder: number | { id: number }, task: number | { id: number } } | [workOrder: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return update.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderTaskController::update
* @see app/Http/Controllers/WorkOrderTaskController.php:36
* @route '/work-orders/{workOrder}/tasks/{task}'
*/
update.patch = (args: { workOrder: number | { id: number }, task: number | { id: number } } | [workOrder: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

const WorkOrderTaskController = { store, update }

export default WorkOrderTaskController