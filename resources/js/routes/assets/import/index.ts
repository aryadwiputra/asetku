import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/assets-import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AssetImportController::validate
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/assets-import/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::validate
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::validate
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::apply
* @see app/Http/Controllers/AssetImportController.php:78
* @route '/assets-import/{importRun}/apply'
*/
export const apply = (args: { importRun: number | { id: number } } | [importRun: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/assets-import/{importRun}/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::apply
* @see app/Http/Controllers/AssetImportController.php:78
* @route '/assets-import/{importRun}/apply'
*/
apply.url = (args: { importRun: number | { id: number } } | [importRun: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { importRun: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { importRun: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            importRun: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        importRun: typeof args.importRun === 'object'
        ? args.importRun.id
        : args.importRun,
    }

    return apply.definition.url
            .replace('{importRun}', parsedArgs.importRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::apply
* @see app/Http/Controllers/AssetImportController.php:78
* @route '/assets-import/{importRun}/apply'
*/
apply.post = (args: { importRun: number | { id: number } } | [importRun: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::photosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
export const photosZip = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photosZip.url(options),
    method: 'post',
})

photosZip.definition = {
    methods: ["post"],
    url: '/assets-import/photos-zip',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::photosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
photosZip.url = (options?: RouteQueryOptions) => {
    return photosZip.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::photosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
photosZip.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photosZip.url(options),
    method: 'post',
})

const importMethod = {
    index: Object.assign(index, index),
    validate: Object.assign(validate, validate),
    apply: Object.assign(apply, apply),
    photosZip: Object.assign(photosZip, photosZip),
}

export default importMethod