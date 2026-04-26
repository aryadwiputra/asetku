import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
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

const MasterDataHomeController = { index }

export default MasterDataHomeController