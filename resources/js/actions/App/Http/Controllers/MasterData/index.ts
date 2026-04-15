import MasterDataHomeController from './MasterDataHomeController'
import AssetStatusController from './AssetStatusController'
import AssetClassController from './AssetClassController'
import UnitController from './UnitController'
import DepartmentController from './DepartmentController'
import PersonInChargeController from './PersonInChargeController'
import AssetUserController from './AssetUserController'

const MasterData = {
    MasterDataHomeController: Object.assign(MasterDataHomeController, MasterDataHomeController),
    AssetStatusController: Object.assign(AssetStatusController, AssetStatusController),
    AssetClassController: Object.assign(AssetClassController, AssetClassController),
    UnitController: Object.assign(UnitController, UnitController),
    DepartmentController: Object.assign(DepartmentController, DepartmentController),
    PersonInChargeController: Object.assign(PersonInChargeController, PersonInChargeController),
    AssetUserController: Object.assign(AssetUserController, AssetUserController),
}

export default MasterData