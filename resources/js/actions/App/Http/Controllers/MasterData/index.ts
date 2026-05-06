import MasterDataHomeController from './MasterDataHomeController'
import AssetStatusController from './AssetStatusController'
import AssetConditionController from './AssetConditionController'
import AssetClassController from './AssetClassController'
import UnitController from './UnitController'
import DepartmentController from './DepartmentController'
import PersonInChargeController from './PersonInChargeController'
import AssetUserController from './AssetUserController'
import AssetCategoryController from './AssetCategoryController'
import AssetLocationController from './AssetLocationController'
import VendorController from './VendorController'
import WarrantyController from './WarrantyController'

const MasterData = {
    MasterDataHomeController: Object.assign(MasterDataHomeController, MasterDataHomeController),
    AssetStatusController: Object.assign(AssetStatusController, AssetStatusController),
    AssetConditionController: Object.assign(AssetConditionController, AssetConditionController),
    AssetClassController: Object.assign(AssetClassController, AssetClassController),
    UnitController: Object.assign(UnitController, UnitController),
    DepartmentController: Object.assign(DepartmentController, DepartmentController),
    PersonInChargeController: Object.assign(PersonInChargeController, PersonInChargeController),
    AssetUserController: Object.assign(AssetUserController, AssetUserController),
    AssetCategoryController: Object.assign(AssetCategoryController, AssetCategoryController),
    AssetLocationController: Object.assign(AssetLocationController, AssetLocationController),
    VendorController: Object.assign(VendorController, VendorController),
    WarrantyController: Object.assign(WarrantyController, WarrantyController),
}

export default MasterData