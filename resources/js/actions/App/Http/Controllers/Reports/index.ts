import InventoryReportController from './InventoryReportController'
import InventoryStocktakePrintController from './InventoryStocktakePrintController'
import WorkOrderReportController from './WorkOrderReportController'
import MaintenanceCostReportController from './MaintenanceCostReportController'

const Reports = {
    InventoryReportController: Object.assign(InventoryReportController, InventoryReportController),
    InventoryStocktakePrintController: Object.assign(InventoryStocktakePrintController, InventoryStocktakePrintController),
    WorkOrderReportController: Object.assign(WorkOrderReportController, WorkOrderReportController),
    MaintenanceCostReportController: Object.assign(MaintenanceCostReportController, MaintenanceCostReportController),
}

export default Reports