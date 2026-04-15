import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AssetImportController::index
* @see app/Http/Controllers/AssetImportController.php:18
* @route '/assets-import'
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
* @see \App\Http\Controllers\AssetImportController::validateFile
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
export const validateFile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateFile.url(options),
    method: 'post',
})

validateFile.definition = {
    methods: ["post"],
    url: '/assets-import/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::validateFile
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
validateFile.url = (options?: RouteQueryOptions) => {
    return validateFile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::validateFile
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
validateFile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateFile.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::validateFile
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
const validateFileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: validateFile.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::validateFile
* @see app/Http/Controllers/AssetImportController.php:40
* @route '/assets-import/validate'
*/
validateFileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: validateFile.url(options),
    method: 'post',
})

validateFile.form = validateFileForm

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
* @see \App\Http\Controllers\AssetImportController::apply
* @see app/Http/Controllers/AssetImportController.php:78
* @route '/assets-import/{importRun}/apply'
*/
const applyForm = (args: { importRun: number | { id: number } } | [importRun: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::apply
* @see app/Http/Controllers/AssetImportController.php:78
* @route '/assets-import/{importRun}/apply'
*/
applyForm.post = (args: { importRun: number | { id: number } } | [importRun: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

apply.form = applyForm

/**
* @see \App\Http\Controllers\AssetImportController::importPhotosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
export const importPhotosZip = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importPhotosZip.url(options),
    method: 'post',
})

importPhotosZip.definition = {
    methods: ["post"],
    url: '/assets-import/photos-zip',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::importPhotosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
importPhotosZip.url = (options?: RouteQueryOptions) => {
    return importPhotosZip.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::importPhotosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
importPhotosZip.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importPhotosZip.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::importPhotosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
const importPhotosZipForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importPhotosZip.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AssetImportController::importPhotosZip
* @see app/Http/Controllers/AssetImportController.php:103
* @route '/assets-import/photos-zip'
*/
importPhotosZipForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importPhotosZip.url(options),
    method: 'post',
})

importPhotosZip.form = importPhotosZipForm

const AssetImportController = { index, validateFile, apply, importPhotosZip }

export default AssetImportController