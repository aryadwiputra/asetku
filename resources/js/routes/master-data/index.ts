import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import assetStatuses from './asset-statuses'
import assetClasses from './asset-classes'
import units from './units'
import departments from './departments'
import personInCharges from './person-in-charges'
import assetUsers from './asset-users'
/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/master-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasterData\MasterDataHomeController::index
* @see app/Http/Controllers/MasterData/MasterDataHomeController.php:13
* @route '/settings/master-data'
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

const masterData = {
    index: Object.assign(index, index),
    assetStatuses: Object.assign(assetStatuses, assetStatuses),
    assetClasses: Object.assign(assetClasses, assetClasses),
    units: Object.assign(units, units),
    departments: Object.assign(departments, departments),
    personInCharges: Object.assign(personInCharges, personInCharges),
    assetUsers: Object.assign(assetUsers, assetUsers),
}

export default masterData