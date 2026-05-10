import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditScheduleController::index
* @see app/Http/Controllers/AuditScheduleController.php:25
* @route '/audit/schedules'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/audit/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::index
* @see app/Http/Controllers/AuditScheduleController.php:25
* @route '/audit/schedules'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::index
* @see app/Http/Controllers/AuditScheduleController.php:25
* @route '/audit/schedules'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::index
* @see app/Http/Controllers/AuditScheduleController.php:25
* @route '/audit/schedules'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::create
* @see app/Http/Controllers/AuditScheduleController.php:84
* @route '/audit/schedules/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/audit/schedules/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::create
* @see app/Http/Controllers/AuditScheduleController.php:84
* @route '/audit/schedules/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::create
* @see app/Http/Controllers/AuditScheduleController.php:84
* @route '/audit/schedules/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::create
* @see app/Http/Controllers/AuditScheduleController.php:84
* @route '/audit/schedules/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::store
* @see app/Http/Controllers/AuditScheduleController.php:122
* @route '/audit/schedules'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/audit/schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::store
* @see app/Http/Controllers/AuditScheduleController.php:122
* @route '/audit/schedules'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::store
* @see app/Http/Controllers/AuditScheduleController.php:122
* @route '/audit/schedules'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::show
* @see app/Http/Controllers/AuditScheduleController.php:155
* @route '/audit/schedules/{auditSchedule}'
*/
export const show = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/audit/schedules/{auditSchedule}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::show
* @see app/Http/Controllers/AuditScheduleController.php:155
* @route '/audit/schedules/{auditSchedule}'
*/
show.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return show.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::show
* @see app/Http/Controllers/AuditScheduleController.php:155
* @route '/audit/schedules/{auditSchedule}'
*/
show.get = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::show
* @see app/Http/Controllers/AuditScheduleController.php:155
* @route '/audit/schedules/{auditSchedule}'
*/
show.head = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::edit
* @see app/Http/Controllers/AuditScheduleController.php:222
* @route '/audit/schedules/{auditSchedule}/edit'
*/
export const edit = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/audit/schedules/{auditSchedule}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::edit
* @see app/Http/Controllers/AuditScheduleController.php:222
* @route '/audit/schedules/{auditSchedule}/edit'
*/
edit.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return edit.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::edit
* @see app/Http/Controllers/AuditScheduleController.php:222
* @route '/audit/schedules/{auditSchedule}/edit'
*/
edit.get = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::edit
* @see app/Http/Controllers/AuditScheduleController.php:222
* @route '/audit/schedules/{auditSchedule}/edit'
*/
edit.head = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::update
* @see app/Http/Controllers/AuditScheduleController.php:263
* @route '/audit/schedules/{auditSchedule}'
*/
export const update = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/audit/schedules/{auditSchedule}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::update
* @see app/Http/Controllers/AuditScheduleController.php:263
* @route '/audit/schedules/{auditSchedule}'
*/
update.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return update.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::update
* @see app/Http/Controllers/AuditScheduleController.php:263
* @route '/audit/schedules/{auditSchedule}'
*/
update.patch = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::destroy
* @see app/Http/Controllers/AuditScheduleController.php:305
* @route '/audit/schedules/{auditSchedule}'
*/
export const destroy = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/audit/schedules/{auditSchedule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::destroy
* @see app/Http/Controllers/AuditScheduleController.php:305
* @route '/audit/schedules/{auditSchedule}'
*/
destroy.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return destroy.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::destroy
* @see app/Http/Controllers/AuditScheduleController.php:305
* @route '/audit/schedules/{auditSchedule}'
*/
destroy.delete = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::start
* @see app/Http/Controllers/AuditScheduleController.php:316
* @route '/audit/schedules/{auditSchedule}/start'
*/
export const start = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/audit/schedules/{auditSchedule}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::start
* @see app/Http/Controllers/AuditScheduleController.php:316
* @route '/audit/schedules/{auditSchedule}/start'
*/
start.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return start.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::start
* @see app/Http/Controllers/AuditScheduleController.php:316
* @route '/audit/schedules/{auditSchedule}/start'
*/
start.post = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditScheduleController::complete
* @see app/Http/Controllers/AuditScheduleController.php:331
* @route '/audit/schedules/{auditSchedule}/complete'
*/
export const complete = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/audit/schedules/{auditSchedule}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditScheduleController::complete
* @see app/Http/Controllers/AuditScheduleController.php:331
* @route '/audit/schedules/{auditSchedule}/complete'
*/
complete.url = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditSchedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditSchedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditSchedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditSchedule: typeof args.auditSchedule === 'object'
        ? args.auditSchedule.id
        : args.auditSchedule,
    }

    return complete.definition.url
            .replace('{auditSchedule}', parsedArgs.auditSchedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditScheduleController::complete
* @see app/Http/Controllers/AuditScheduleController.php:331
* @route '/audit/schedules/{auditSchedule}/complete'
*/
complete.post = (args: { auditSchedule: number | { id: number } } | [auditSchedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

const AuditScheduleController = { index, create, store, show, edit, update, destroy, start, complete }

export default AuditScheduleController