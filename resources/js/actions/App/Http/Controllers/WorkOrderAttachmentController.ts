import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::store
* @see app/Http/Controllers/WorkOrderAttachmentController.php:15
* @route '/work-orders/{workOrder}/attachments'
*/
export const store = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::store
* @see app/Http/Controllers/WorkOrderAttachmentController.php:15
* @route '/work-orders/{workOrder}/attachments'
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
* @see \App\Http\Controllers\WorkOrderAttachmentController::store
* @see app/Http/Controllers/WorkOrderAttachmentController.php:15
* @route '/work-orders/{workOrder}/attachments'
*/
store.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::store
* @see app/Http/Controllers/WorkOrderAttachmentController.php:15
* @route '/work-orders/{workOrder}/attachments'
*/
const storeForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::store
* @see app/Http/Controllers/WorkOrderAttachmentController.php:15
* @route '/work-orders/{workOrder}/attachments'
*/
storeForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::destroy
* @see app/Http/Controllers/WorkOrderAttachmentController.php:48
* @route '/work-orders/{workOrder}/attachments/{attachment}'
*/
export const destroy = (args: { workOrder: number | { id: number }, attachment: number | { id: number } } | [workOrder: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/work-orders/{workOrder}/attachments/{attachment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::destroy
* @see app/Http/Controllers/WorkOrderAttachmentController.php:48
* @route '/work-orders/{workOrder}/attachments/{attachment}'
*/
destroy.url = (args: { workOrder: number | { id: number }, attachment: number | { id: number } } | [workOrder: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workOrder: args[0],
            attachment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workOrder: typeof args.workOrder === 'object'
        ? args.workOrder.id
        : args.workOrder,
        attachment: typeof args.attachment === 'object'
        ? args.attachment.id
        : args.attachment,
    }

    return destroy.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::destroy
* @see app/Http/Controllers/WorkOrderAttachmentController.php:48
* @route '/work-orders/{workOrder}/attachments/{attachment}'
*/
destroy.delete = (args: { workOrder: number | { id: number }, attachment: number | { id: number } } | [workOrder: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::destroy
* @see app/Http/Controllers/WorkOrderAttachmentController.php:48
* @route '/work-orders/{workOrder}/attachments/{attachment}'
*/
const destroyForm = (args: { workOrder: number | { id: number }, attachment: number | { id: number } } | [workOrder: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkOrderAttachmentController::destroy
* @see app/Http/Controllers/WorkOrderAttachmentController.php:48
* @route '/work-orders/{workOrder}/attachments/{attachment}'
*/
destroyForm.delete = (args: { workOrder: number | { id: number }, attachment: number | { id: number } } | [workOrder: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const WorkOrderAttachmentController = { store, destroy }

export default WorkOrderAttachmentController