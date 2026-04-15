import MasterDataHomeController from './MasterDataHomeController'
import AssetStatusController from './AssetStatusController'
import AssetClassController from './AssetClassController'
import UnitController from './UnitController'

const MasterData = {
    MasterDataHomeController: Object.assign(MasterDataHomeController, MasterDataHomeController),
    AssetStatusController: Object.assign(AssetStatusController, AssetStatusController),
    AssetClassController: Object.assign(AssetClassController, AssetClassController),
    UnitController: Object.assign(UnitController, UnitController),
}

export default MasterData