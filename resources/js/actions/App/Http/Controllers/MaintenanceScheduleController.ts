import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceScheduleController::index
* @see app/Http/Controllers/MaintenanceScheduleController.php:21
* @route '/maintenance-schedules'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/maintenance-schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::index
* @see app/Http/Controllers/MaintenanceScheduleController.php:21
* @route '/maintenance-schedules'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::index
* @see app/Http/Controllers/MaintenanceScheduleController.php:21
* @route '/maintenance-schedules'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::index
* @see app/Http/Controllers/MaintenanceScheduleController.php:21
* @route '/maintenance-schedules'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::create
* @see app/Http/Controllers/MaintenanceScheduleController.php:62
* @route '/maintenance-schedules/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/maintenance-schedules/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::create
* @see app/Http/Controllers/MaintenanceScheduleController.php:62
* @route '/maintenance-schedules/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::create
* @see app/Http/Controllers/MaintenanceScheduleController.php:62
* @route '/maintenance-schedules/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::create
* @see app/Http/Controllers/MaintenanceScheduleController.php:62
* @route '/maintenance-schedules/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::store
* @see app/Http/Controllers/MaintenanceScheduleController.php:101
* @route '/maintenance-schedules'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/maintenance-schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::store
* @see app/Http/Controllers/MaintenanceScheduleController.php:101
* @route '/maintenance-schedules'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::store
* @see app/Http/Controllers/MaintenanceScheduleController.php:101
* @route '/maintenance-schedules'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::edit
* @see app/Http/Controllers/MaintenanceScheduleController.php:128
* @route '/maintenance-schedules/{schedule}/edit'
*/
export const edit = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/maintenance-schedules/{schedule}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::edit
* @see app/Http/Controllers/MaintenanceScheduleController.php:128
* @route '/maintenance-schedules/{schedule}/edit'
*/
edit.url = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { schedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: typeof args.schedule === 'object'
        ? args.schedule.id
        : args.schedule,
    }

    return edit.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::edit
* @see app/Http/Controllers/MaintenanceScheduleController.php:128
* @route '/maintenance-schedules/{schedule}/edit'
*/
edit.get = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::edit
* @see app/Http/Controllers/MaintenanceScheduleController.php:128
* @route '/maintenance-schedules/{schedule}/edit'
*/
edit.head = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleController.php:150
* @route '/maintenance-schedules/{schedule}'
*/
export const update = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/maintenance-schedules/{schedule}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleController.php:150
* @route '/maintenance-schedules/{schedule}'
*/
update.url = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { schedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: typeof args.schedule === 'object'
        ? args.schedule.id
        : args.schedule,
    }

    return update.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleController.php:150
* @route '/maintenance-schedules/{schedule}'
*/
update.put = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleController.php:150
* @route '/maintenance-schedules/{schedule}'
*/
update.patch = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::destroy
* @see app/Http/Controllers/MaintenanceScheduleController.php:175
* @route '/maintenance-schedules/{schedule}'
*/
export const destroy = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/maintenance-schedules/{schedule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::destroy
* @see app/Http/Controllers/MaintenanceScheduleController.php:175
* @route '/maintenance-schedules/{schedule}'
*/
destroy.url = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { schedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: typeof args.schedule === 'object'
        ? args.schedule.id
        : args.schedule,
    }

    return destroy.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleController::destroy
* @see app/Http/Controllers/MaintenanceScheduleController.php:175
* @route '/maintenance-schedules/{schedule}'
*/
destroy.delete = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MaintenanceScheduleController = { index, create, store, edit, update, destroy }

export default MaintenanceScheduleController