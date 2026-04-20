import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MasterData\DepartmentController::index
* @see app/Http/Controllers/MasterData/DepartmentController.php:17
* @route '/settings/master-data/departments'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::index
* @see app/Http/Controllers/MasterData/DepartmentController.php:17
* @route '/settings/master-data/departments'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::index
* @see app/Http/Controllers/MasterData/DepartmentController.php:17
* @route '/settings/master-data/departments'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::index
* @see app/Http/Controllers/MasterData/DepartmentController.php:17
* @route '/settings/master-data/departments'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::create
* @see app/Http/Controllers/MasterData/DepartmentController.php:49
* @route '/settings/master-data/departments/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/departments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::create
* @see app/Http/Controllers/MasterData/DepartmentController.php:49
* @route '/settings/master-data/departments/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::create
* @see app/Http/Controllers/MasterData/DepartmentController.php:49
* @route '/settings/master-data/departments/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::create
* @see app/Http/Controllers/MasterData/DepartmentController.php:49
* @route '/settings/master-data/departments/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::store
* @see app/Http/Controllers/MasterData/DepartmentController.php:63
* @route '/settings/master-data/departments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/master-data/departments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::store
* @see app/Http/Controllers/MasterData/DepartmentController.php:63
* @route '/settings/master-data/departments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::store
* @see app/Http/Controllers/MasterData/DepartmentController.php:63
* @route '/settings/master-data/departments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::edit
* @see app/Http/Controllers/MasterData/DepartmentController.php:74
* @route '/settings/master-data/departments/{department}/edit'
*/
export const edit = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/master-data/departments/{department}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::edit
* @see app/Http/Controllers/MasterData/DepartmentController.php:74
* @route '/settings/master-data/departments/{department}/edit'
*/
edit.url = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { department: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
    }

    return edit.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::edit
* @see app/Http/Controllers/MasterData/DepartmentController.php:74
* @route '/settings/master-data/departments/{department}/edit'
*/
edit.get = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::edit
* @see app/Http/Controllers/MasterData/DepartmentController.php:74
* @route '/settings/master-data/departments/{department}/edit'
*/
edit.head = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::update
* @see app/Http/Controllers/MasterData/DepartmentController.php:88
* @route '/settings/master-data/departments/{department}'
*/
export const update = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/master-data/departments/{department}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::update
* @see app/Http/Controllers/MasterData/DepartmentController.php:88
* @route '/settings/master-data/departments/{department}'
*/
update.url = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { department: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
    }

    return update.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::update
* @see app/Http/Controllers/MasterData/DepartmentController.php:88
* @route '/settings/master-data/departments/{department}'
*/
update.put = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::update
* @see app/Http/Controllers/MasterData/DepartmentController.php:88
* @route '/settings/master-data/departments/{department}'
*/
update.patch = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::destroy
* @see app/Http/Controllers/MasterData/DepartmentController.php:99
* @route '/settings/master-data/departments/{department}'
*/
export const destroy = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/master-data/departments/{department}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::destroy
* @see app/Http/Controllers/MasterData/DepartmentController.php:99
* @route '/settings/master-data/departments/{department}'
*/
destroy.url = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { department: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
    }

    return destroy.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\DepartmentController::destroy
* @see app/Http/Controllers/MasterData/DepartmentController.php:99
* @route '/settings/master-data/departments/{department}'
*/
destroy.delete = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const DepartmentController = { index, create, store, edit, update, destroy }

export default DepartmentController