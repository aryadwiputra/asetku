import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TechnicianController::index
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/technicians'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/technicians',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TechnicianController::index
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/technicians'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::index
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/technicians'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::index
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/technicians'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TechnicianController::create
* @see app/Http/Controllers/TechnicianController.php:44
* @route '/technicians/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/technicians/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TechnicianController::create
* @see app/Http/Controllers/TechnicianController.php:44
* @route '/technicians/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::create
* @see app/Http/Controllers/TechnicianController.php:44
* @route '/technicians/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::create
* @see app/Http/Controllers/TechnicianController.php:44
* @route '/technicians/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:64
* @route '/technicians'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/technicians',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:64
* @route '/technicians'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:64
* @route '/technicians'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::edit
* @see app/Http/Controllers/TechnicianController.php:98
* @route '/technicians/{technician}/edit'
*/
export const edit = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/technicians/{technician}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TechnicianController::edit
* @see app/Http/Controllers/TechnicianController.php:98
* @route '/technicians/{technician}/edit'
*/
edit.url = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technician: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { technician: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            technician: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        technician: typeof args.technician === 'object'
        ? args.technician.id
        : args.technician,
    }

    return edit.definition.url
            .replace('{technician}', parsedArgs.technician.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::edit
* @see app/Http/Controllers/TechnicianController.php:98
* @route '/technicians/{technician}/edit'
*/
edit.get = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::edit
* @see app/Http/Controllers/TechnicianController.php:98
* @route '/technicians/{technician}/edit'
*/
edit.head = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:112
* @route '/technicians/{technician}'
*/
export const update = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/technicians/{technician}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:112
* @route '/technicians/{technician}'
*/
update.url = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technician: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { technician: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            technician: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        technician: typeof args.technician === 'object'
        ? args.technician.id
        : args.technician,
    }

    return update.definition.url
            .replace('{technician}', parsedArgs.technician.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:112
* @route '/technicians/{technician}'
*/
update.put = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:112
* @route '/technicians/{technician}'
*/
update.patch = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TechnicianController::destroy
* @see app/Http/Controllers/TechnicianController.php:130
* @route '/technicians/{technician}'
*/
export const destroy = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/technicians/{technician}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TechnicianController::destroy
* @see app/Http/Controllers/TechnicianController.php:130
* @route '/technicians/{technician}'
*/
destroy.url = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technician: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { technician: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            technician: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        technician: typeof args.technician === 'object'
        ? args.technician.id
        : args.technician,
    }

    return destroy.definition.url
            .replace('{technician}', parsedArgs.technician.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::destroy
* @see app/Http/Controllers/TechnicianController.php:130
* @route '/technicians/{technician}'
*/
destroy.delete = (args: { technician: number | { id: number } } | [technician: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TechnicianController = { index, create, store, edit, update, destroy }

export default TechnicianController