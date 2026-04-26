import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see routes/web.php:42
* @route '/api/docs.json'
*/
export const document = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(options),
    method: 'get',
})

document.definition = {
    methods: ["get","head"],
    url: '/api/docs.json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:42
* @route '/api/docs.json'
*/
document.url = (options?: RouteQueryOptions) => {
    return document.definition.url + queryParams(options)
}

/**
* @see routes/web.php:42
* @route '/api/docs.json'
*/
document.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(options),
    method: 'get',
})

/**
* @see routes/web.php:42
* @route '/api/docs.json'
*/
document.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: document.url(options),
    method: 'head',
})

const docs = {
    document: Object.assign(document, document),
}

export default docs