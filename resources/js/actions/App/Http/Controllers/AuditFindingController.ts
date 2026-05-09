import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/audit/findings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::index
* @see app/Http/Controllers/AuditFindingController.php:26
* @route '/audit/findings'
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
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
export const createForAsset = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForAsset.url(args, options),
    method: 'get',
})

createForAsset.definition = {
    methods: ["get","head"],
    url: '/audit/findings/create/{asset}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
createForAsset.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asset: typeof args.asset === 'object'
        ? args.asset.id
        : args.asset,
    }

    return createForAsset.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
createForAsset.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForAsset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
createForAsset.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createForAsset.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
const createForAssetForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createForAsset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
createForAssetForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createForAsset.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::createForAsset
* @see app/Http/Controllers/AuditFindingController.php:60
* @route '/audit/findings/create/{asset}'
*/
createForAssetForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createForAsset.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createForAsset.form = createForAssetForm

/**
* @see \App\Http\Controllers\AuditFindingController::store
* @see app/Http/Controllers/AuditFindingController.php:91
* @route '/audit/findings'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/audit/findings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditFindingController::store
* @see app/Http/Controllers/AuditFindingController.php:91
* @route '/audit/findings'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::store
* @see app/Http/Controllers/AuditFindingController.php:91
* @route '/audit/findings'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::store
* @see app/Http/Controllers/AuditFindingController.php:91
* @route '/audit/findings'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::store
* @see app/Http/Controllers/AuditFindingController.php:91
* @route '/audit/findings'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
export const edit = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/audit/findings/{auditFinding}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
edit.url = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditFinding: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditFinding: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditFinding: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditFinding: typeof args.auditFinding === 'object'
        ? args.auditFinding.id
        : args.auditFinding,
    }

    return edit.definition.url
            .replace('{auditFinding}', parsedArgs.auditFinding.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
edit.get = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
edit.head = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
const editForm = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
editForm.get = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditFindingController::edit
* @see app/Http/Controllers/AuditFindingController.php:159
* @route '/audit/findings/{auditFinding}/edit'
*/
editForm.head = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AuditFindingController::update
* @see app/Http/Controllers/AuditFindingController.php:203
* @route '/audit/findings/{auditFinding}'
*/
export const update = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/audit/findings/{auditFinding}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AuditFindingController::update
* @see app/Http/Controllers/AuditFindingController.php:203
* @route '/audit/findings/{auditFinding}'
*/
update.url = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditFinding: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditFinding: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditFinding: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditFinding: typeof args.auditFinding === 'object'
        ? args.auditFinding.id
        : args.auditFinding,
    }

    return update.definition.url
            .replace('{auditFinding}', parsedArgs.auditFinding.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::update
* @see app/Http/Controllers/AuditFindingController.php:203
* @route '/audit/findings/{auditFinding}'
*/
update.patch = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AuditFindingController::update
* @see app/Http/Controllers/AuditFindingController.php:203
* @route '/audit/findings/{auditFinding}'
*/
const updateForm = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::update
* @see app/Http/Controllers/AuditFindingController.php:203
* @route '/audit/findings/{auditFinding}'
*/
updateForm.patch = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AuditFindingController::approve
* @see app/Http/Controllers/AuditFindingController.php:236
* @route '/audit/findings/{auditFinding}/approve'
*/
export const approve = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/audit/findings/{auditFinding}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditFindingController::approve
* @see app/Http/Controllers/AuditFindingController.php:236
* @route '/audit/findings/{auditFinding}/approve'
*/
approve.url = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditFinding: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditFinding: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditFinding: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditFinding: typeof args.auditFinding === 'object'
        ? args.auditFinding.id
        : args.auditFinding,
    }

    return approve.definition.url
            .replace('{auditFinding}', parsedArgs.auditFinding.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::approve
* @see app/Http/Controllers/AuditFindingController.php:236
* @route '/audit/findings/{auditFinding}/approve'
*/
approve.post = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::approve
* @see app/Http/Controllers/AuditFindingController.php:236
* @route '/audit/findings/{auditFinding}/approve'
*/
const approveForm = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::approve
* @see app/Http/Controllers/AuditFindingController.php:236
* @route '/audit/findings/{auditFinding}/approve'
*/
approveForm.post = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\AuditFindingController::reject
* @see app/Http/Controllers/AuditFindingController.php:254
* @route '/audit/findings/{auditFinding}/reject'
*/
export const reject = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/audit/findings/{auditFinding}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditFindingController::reject
* @see app/Http/Controllers/AuditFindingController.php:254
* @route '/audit/findings/{auditFinding}/reject'
*/
reject.url = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditFinding: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditFinding: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditFinding: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditFinding: typeof args.auditFinding === 'object'
        ? args.auditFinding.id
        : args.auditFinding,
    }

    return reject.definition.url
            .replace('{auditFinding}', parsedArgs.auditFinding.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::reject
* @see app/Http/Controllers/AuditFindingController.php:254
* @route '/audit/findings/{auditFinding}/reject'
*/
reject.post = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::reject
* @see app/Http/Controllers/AuditFindingController.php:254
* @route '/audit/findings/{auditFinding}/reject'
*/
const rejectForm = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::reject
* @see app/Http/Controllers/AuditFindingController.php:254
* @route '/audit/findings/{auditFinding}/reject'
*/
rejectForm.post = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\AuditFindingController::destroy
* @see app/Http/Controllers/AuditFindingController.php:270
* @route '/audit/findings/{auditFinding}'
*/
export const destroy = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/audit/findings/{auditFinding}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AuditFindingController::destroy
* @see app/Http/Controllers/AuditFindingController.php:270
* @route '/audit/findings/{auditFinding}'
*/
destroy.url = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditFinding: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditFinding: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditFinding: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditFinding: typeof args.auditFinding === 'object'
        ? args.auditFinding.id
        : args.auditFinding,
    }

    return destroy.definition.url
            .replace('{auditFinding}', parsedArgs.auditFinding.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditFindingController::destroy
* @see app/Http/Controllers/AuditFindingController.php:270
* @route '/audit/findings/{auditFinding}'
*/
destroy.delete = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AuditFindingController::destroy
* @see app/Http/Controllers/AuditFindingController.php:270
* @route '/audit/findings/{auditFinding}'
*/
const destroyForm = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditFindingController::destroy
* @see app/Http/Controllers/AuditFindingController.php:270
* @route '/audit/findings/{auditFinding}'
*/
destroyForm.delete = (args: { auditFinding: number | { id: number } } | [auditFinding: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AuditFindingController = { index, createForAsset, store, edit, update, approve, reject, destroy }

export default AuditFindingController