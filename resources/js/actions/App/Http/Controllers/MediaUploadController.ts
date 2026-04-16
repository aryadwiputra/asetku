import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MediaUploadController::store
* @see app/Http/Controllers/MediaUploadController.php:60
* @route '/media/uploads'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/media/uploads',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaUploadController::store
* @see app/Http/Controllers/MediaUploadController.php:60
* @route '/media/uploads'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaUploadController::store
* @see app/Http/Controllers/MediaUploadController.php:60
* @route '/media/uploads'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaUploadController::chunk
* @see app/Http/Controllers/MediaUploadController.php:85
* @route '/media/uploads/{upload}/chunk'
*/
export const chunk = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: chunk.url(args, options),
    method: 'post',
})

chunk.definition = {
    methods: ["post"],
    url: '/media/uploads/{upload}/chunk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaUploadController::chunk
* @see app/Http/Controllers/MediaUploadController.php:85
* @route '/media/uploads/{upload}/chunk'
*/
chunk.url = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { upload: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { upload: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            upload: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        upload: typeof args.upload === 'object'
        ? args.upload.id
        : args.upload,
    }

    return chunk.definition.url
            .replace('{upload}', parsedArgs.upload.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaUploadController::chunk
* @see app/Http/Controllers/MediaUploadController.php:85
* @route '/media/uploads/{upload}/chunk'
*/
chunk.post = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: chunk.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaUploadController::complete
* @see app/Http/Controllers/MediaUploadController.php:106
* @route '/media/uploads/{upload}/complete'
*/
export const complete = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/media/uploads/{upload}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaUploadController::complete
* @see app/Http/Controllers/MediaUploadController.php:106
* @route '/media/uploads/{upload}/complete'
*/
complete.url = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { upload: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { upload: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            upload: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        upload: typeof args.upload === 'object'
        ? args.upload.id
        : args.upload,
    }

    return complete.definition.url
            .replace('{upload}', parsedArgs.upload.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaUploadController::complete
* @see app/Http/Controllers/MediaUploadController.php:106
* @route '/media/uploads/{upload}/complete'
*/
complete.post = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaUploadController::destroy
* @see app/Http/Controllers/MediaUploadController.php:135
* @route '/media/uploads/{upload}'
*/
export const destroy = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/media/uploads/{upload}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MediaUploadController::destroy
* @see app/Http/Controllers/MediaUploadController.php:135
* @route '/media/uploads/{upload}'
*/
destroy.url = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { upload: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { upload: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            upload: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        upload: typeof args.upload === 'object'
        ? args.upload.id
        : args.upload,
    }

    return destroy.definition.url
            .replace('{upload}', parsedArgs.upload.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaUploadController::destroy
* @see app/Http/Controllers/MediaUploadController.php:135
* @route '/media/uploads/{upload}'
*/
destroy.delete = (args: { upload: string | { id: string } } | [upload: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MediaUploadController = { store, chunk, complete, destroy }

export default MediaUploadController