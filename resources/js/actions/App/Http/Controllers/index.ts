import Api from './Api'
import LocaleController from './LocaleController'
import OrganizationController from './OrganizationController'
import OrganizationSwitchController from './OrganizationSwitchController'
import OrganizationImportTemplateController from './OrganizationImportTemplateController'
import OrganizationOnboardingController from './OrganizationOnboardingController'
import BranchController from './BranchController'
import UserController from './UserController'
import RoleController from './RoleController'
import ImpersonationController from './ImpersonationController'
import ColumnPreferenceController from './ColumnPreferenceController'
import Settings from './Settings'
import NotificationsController from './NotificationsController'
import MediaAssetController from './MediaAssetController'
import MediaUploadController from './MediaUploadController'

const Controllers = {
    Api: Object.assign(Api, Api),
    LocaleController: Object.assign(LocaleController, LocaleController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    OrganizationSwitchController: Object.assign(OrganizationSwitchController, OrganizationSwitchController),
    OrganizationImportTemplateController: Object.assign(OrganizationImportTemplateController, OrganizationImportTemplateController),
    OrganizationOnboardingController: Object.assign(OrganizationOnboardingController, OrganizationOnboardingController),
    BranchController: Object.assign(BranchController, BranchController),
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    ImpersonationController: Object.assign(ImpersonationController, ImpersonationController),
    ColumnPreferenceController: Object.assign(ColumnPreferenceController, ColumnPreferenceController),
    Settings: Object.assign(Settings, Settings),
    NotificationsController: Object.assign(NotificationsController, NotificationsController),
    MediaAssetController: Object.assign(MediaAssetController, MediaAssetController),
    MediaUploadController: Object.assign(MediaUploadController, MediaUploadController),
}

export default Controllers