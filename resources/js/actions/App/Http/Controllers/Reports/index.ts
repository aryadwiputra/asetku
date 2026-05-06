import InventoryReportController from './InventoryReportController'
import InventoryStocktakePrintController from './InventoryStocktakePrintController'

const Reports = {
    InventoryReportController: Object.assign(InventoryReportController, InventoryReportController),
    InventoryStocktakePrintController: Object.assign(InventoryStocktakePrintController, InventoryStocktakePrintController),
}

export default Reports