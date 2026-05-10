import inventory from './inventory'
import workOrders from './work-orders'
import maintenanceCosts from './maintenance-costs'

const reports = {
    inventory: Object.assign(inventory, inventory),
    workOrders: Object.assign(workOrders, workOrders),
    maintenanceCosts: Object.assign(maintenanceCosts, maintenanceCosts),
}

export default reports