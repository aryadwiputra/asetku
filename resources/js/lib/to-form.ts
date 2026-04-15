type RouteLike<TMethod extends string> =
    | { url: string; method: TMethod }
    | { url: string; methods: readonly TMethod[] };

export function toForm<TMethod extends string>(route: RouteLike<TMethod>): { action: string; method: TMethod } {
    if ('method' in route) {
        return { action: route.url, method: route.method };
    }

    const method = (route.methods[0] ?? 'get') as TMethod;

    return { action: route.url, method };
}
