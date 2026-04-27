import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MaintenanceScheduleRescheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleRescheduleController.php:16
* @route '/maintenance-schedules/{schedule}/reschedule'
*/
export const update = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/maintenance-schedules/{schedule}/reschedule',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MaintenanceScheduleRescheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleRescheduleController.php:16
* @route '/maintenance-schedules/{schedule}/reschedule'
*/
update.url = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { schedule: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: typeof args.schedule === 'object'
        ? args.schedule.id
        : args.schedule,
    }

    return update.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaintenanceScheduleRescheduleController::update
* @see app/Http/Controllers/MaintenanceScheduleRescheduleController.php:16
* @route '/maintenance-schedules/{schedule}/reschedule'
*/
update.patch = (args: { schedule: number | { id: number } } | [schedule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

const MaintenanceScheduleRescheduleController = { update }

export default MaintenanceScheduleRescheduleController