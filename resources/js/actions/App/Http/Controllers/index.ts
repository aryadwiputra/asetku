import Api from './Api'
import SsoController from './SsoController'
import InvitationAcceptController from './InvitationAcceptController'
import TwoFactorSmsRecoveryController from './TwoFactorSmsRecoveryController'
import LocaleController from './LocaleController'
import OrganizationController from './OrganizationController'
import OrganizationSwitchController from './OrganizationSwitchController'
import OrganizationImportTemplateController from './OrganizationImportTemplateController'
import OrganizationManagementController from './OrganizationManagementController'
import OrganizationOnboardingController from './OrganizationOnboardingController'
import BranchController from './BranchController'
import UserInvitationController from './UserInvitationController'
import UserDelegationController from './UserDelegationController'
import UserController from './UserController'
import RoleController from './RoleController'
import ImpersonationController from './ImpersonationController'
import ColumnPreferenceController from './ColumnPreferenceController'
import Settings from './Settings'
import NotificationsController from './NotificationsController'
import MediaAssetController from './MediaAssetController'
import MediaUploadController from './MediaUploadController'
import MasterData from './MasterData'
import QrController from './QrController'
import AssetController from './AssetController'
import AssetAttachmentController from './AssetAttachmentController'
import AssetLabelController from './AssetLabelController'
import AssetExportController from './AssetExportController'
import AssetSavedFilterController from './AssetSavedFilterController'
import AssetImportController from './AssetImportController'

const Controllers = {
    Api: Object.assign(Api, Api),
    SsoController: Object.assign(SsoController, SsoController),
    InvitationAcceptController: Object.assign(InvitationAcceptController, InvitationAcceptController),
    TwoFactorSmsRecoveryController: Object.assign(TwoFactorSmsRecoveryController, TwoFactorSmsRecoveryController),
    LocaleController: Object.assign(LocaleController, LocaleController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    OrganizationSwitchController: Object.assign(OrganizationSwitchController, OrganizationSwitchController),
    OrganizationImportTemplateController: Object.assign(OrganizationImportTemplateController, OrganizationImportTemplateController),
    OrganizationManagementController: Object.assign(OrganizationManagementController, OrganizationManagementController),
    OrganizationOnboardingController: Object.assign(OrganizationOnboardingController, OrganizationOnboardingController),
    BranchController: Object.assign(BranchController, BranchController),
    UserInvitationController: Object.assign(UserInvitationController, UserInvitationController),
    UserDelegationController: Object.assign(UserDelegationController, UserDelegationController),
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    ImpersonationController: Object.assign(ImpersonationController, ImpersonationController),
    ColumnPreferenceController: Object.assign(ColumnPreferenceController, ColumnPreferenceController),
    Settings: Object.assign(Settings, Settings),
    NotificationsController: Object.assign(NotificationsController, NotificationsController),
    MediaAssetController: Object.assign(MediaAssetController, MediaAssetController),
    MediaUploadController: Object.assign(MediaUploadController, MediaUploadController),
    MasterData: Object.assign(MasterData, MasterData),
    QrController: Object.assign(QrController, QrController),
    AssetController: Object.assign(AssetController, AssetController),
    AssetAttachmentController: Object.assign(AssetAttachmentController, AssetAttachmentController),
    AssetLabelController: Object.assign(AssetLabelController, AssetLabelController),
    AssetExportController: Object.assign(AssetExportController, AssetExportController),
    AssetSavedFilterController: Object.assign(AssetSavedFilterController, AssetSavedFilterController),
    AssetImportController: Object.assign(AssetImportController, AssetImportController),
}

export default Controllers