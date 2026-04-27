import Api from './Api'
import SsoController from './SsoController'
import InvitationAcceptController from './InvitationAcceptController'
import TwoFactorSmsRecoveryController from './TwoFactorSmsRecoveryController'
import LocaleController from './LocaleController'
import DashboardController from './DashboardController'
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
import MaintenanceCalendarFeedController from './MaintenanceCalendarFeedController'
import MaintenanceCalendarController from './MaintenanceCalendarController'
import MaintenanceCalendarEventsController from './MaintenanceCalendarEventsController'
import MaintenanceCalendarFeedTokenController from './MaintenanceCalendarFeedTokenController'
import AssetController from './AssetController'
import VendorContractController from './VendorContractController'
import AssetDisposalController from './AssetDisposalController'
import AssetDisposalApprovalController from './AssetDisposalApprovalController'
import AssetDisposalBaController from './AssetDisposalBaController'
import DepreciationController from './DepreciationController'
import DepreciationRunController from './DepreciationRunController'
import DepreciationAssetController from './DepreciationAssetController'
import DepreciationExportController from './DepreciationExportController'
import AssetUsageLogController from './AssetUsageLogController'
import AssetLifecycleController from './AssetLifecycleController'
import AssetLifecycleStatusController from './AssetLifecycleStatusController'
import AssetLifecycleConditionController from './AssetLifecycleConditionController'
import AssetAttachmentController from './AssetAttachmentController'
import AssetLifecycleEventController from './AssetLifecycleEventController'
import AssetMovementController from './AssetMovementController'
import AssetWarrantyClaimController from './AssetWarrantyClaimController'
import AssetLabelController from './AssetLabelController'
import AssetExportController from './AssetExportController'
import AssetSavedFilterController from './AssetSavedFilterController'
import AssetImportController from './AssetImportController'
import WorkOrderController from './WorkOrderController'
import WorkOrderTaskController from './WorkOrderTaskController'
import WorkOrderCostLineController from './WorkOrderCostLineController'
import WorkOrderAttachmentController from './WorkOrderAttachmentController'
import MaintenanceScheduleRescheduleController from './MaintenanceScheduleRescheduleController'
import MaintenanceScheduleController from './MaintenanceScheduleController'
import MaintenanceChecklistController from './MaintenanceChecklistController'
import TechnicianController from './TechnicianController'
import Reports from './Reports'

const Controllers = {
    Api: Object.assign(Api, Api),
    SsoController: Object.assign(SsoController, SsoController),
    InvitationAcceptController: Object.assign(InvitationAcceptController, InvitationAcceptController),
    TwoFactorSmsRecoveryController: Object.assign(TwoFactorSmsRecoveryController, TwoFactorSmsRecoveryController),
    LocaleController: Object.assign(LocaleController, LocaleController),
    DashboardController: Object.assign(DashboardController, DashboardController),
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
    MaintenanceCalendarFeedController: Object.assign(MaintenanceCalendarFeedController, MaintenanceCalendarFeedController),
    MaintenanceCalendarController: Object.assign(MaintenanceCalendarController, MaintenanceCalendarController),
    MaintenanceCalendarEventsController: Object.assign(MaintenanceCalendarEventsController, MaintenanceCalendarEventsController),
    MaintenanceCalendarFeedTokenController: Object.assign(MaintenanceCalendarFeedTokenController, MaintenanceCalendarFeedTokenController),
    AssetController: Object.assign(AssetController, AssetController),
    VendorContractController: Object.assign(VendorContractController, VendorContractController),
    AssetDisposalController: Object.assign(AssetDisposalController, AssetDisposalController),
    AssetDisposalApprovalController: Object.assign(AssetDisposalApprovalController, AssetDisposalApprovalController),
    AssetDisposalBaController: Object.assign(AssetDisposalBaController, AssetDisposalBaController),
    DepreciationController: Object.assign(DepreciationController, DepreciationController),
    DepreciationRunController: Object.assign(DepreciationRunController, DepreciationRunController),
    DepreciationAssetController: Object.assign(DepreciationAssetController, DepreciationAssetController),
    DepreciationExportController: Object.assign(DepreciationExportController, DepreciationExportController),
    AssetUsageLogController: Object.assign(AssetUsageLogController, AssetUsageLogController),
    AssetLifecycleController: Object.assign(AssetLifecycleController, AssetLifecycleController),
    AssetLifecycleStatusController: Object.assign(AssetLifecycleStatusController, AssetLifecycleStatusController),
    AssetLifecycleConditionController: Object.assign(AssetLifecycleConditionController, AssetLifecycleConditionController),
    AssetAttachmentController: Object.assign(AssetAttachmentController, AssetAttachmentController),
    AssetLifecycleEventController: Object.assign(AssetLifecycleEventController, AssetLifecycleEventController),
    AssetMovementController: Object.assign(AssetMovementController, AssetMovementController),
    AssetWarrantyClaimController: Object.assign(AssetWarrantyClaimController, AssetWarrantyClaimController),
    AssetLabelController: Object.assign(AssetLabelController, AssetLabelController),
    AssetExportController: Object.assign(AssetExportController, AssetExportController),
    AssetSavedFilterController: Object.assign(AssetSavedFilterController, AssetSavedFilterController),
    AssetImportController: Object.assign(AssetImportController, AssetImportController),
    WorkOrderController: Object.assign(WorkOrderController, WorkOrderController),
    WorkOrderTaskController: Object.assign(WorkOrderTaskController, WorkOrderTaskController),
    WorkOrderCostLineController: Object.assign(WorkOrderCostLineController, WorkOrderCostLineController),
    WorkOrderAttachmentController: Object.assign(WorkOrderAttachmentController, WorkOrderAttachmentController),
    MaintenanceScheduleRescheduleController: Object.assign(MaintenanceScheduleRescheduleController, MaintenanceScheduleRescheduleController),
    MaintenanceScheduleController: Object.assign(MaintenanceScheduleController, MaintenanceScheduleController),
    MaintenanceChecklistController: Object.assign(MaintenanceChecklistController, MaintenanceChecklistController),
    TechnicianController: Object.assign(TechnicianController, TechnicianController),
    Reports: Object.assign(Reports, Reports),
}

export default Controllers