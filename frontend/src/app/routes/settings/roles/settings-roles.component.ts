import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { UIFriendlyPermissions } from '../../../i18n/permissions.i18n';
import { RolesService } from '../../../services/api/roles.service';
import { StaticInfoService } from '../../../services/api/static-info.service';
import { Logger } from '../../../services/logger/logger.service';
import { BootstrapService } from '../../../util/bootstrap.service';
import { DialogService } from '../../../util/dialog-manager/dialog.service';
import { ErrorService } from '../../../util/error-manager/error.service';

@Component({
  templateUrl: './settings-roles.component.html',
  styleUrls: ['./settings-roles.component.scss'],
})
export class SettingsRolesComponent implements OnInit, AfterViewInit {
  private readonly logger = new Logger(SettingsRolesComponent.name);

  public readonly displayedColumns: string[] = [
    'name',
    'permissions',
    'actions',
  ];
  public readonly pageSizeOptions: number[] = [5, 10, 25, 100];
  public readonly startingPageSize = this.pageSizeOptions[2];
  public readonly permissionsTruncate = 5;

  public dataSource = new MatTableDataSource<ERole>([]);

  private UndeletableRolesList: string[] = [];
  private ImmutableRolesList: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly rolesService: RolesService,
    private readonly staticInfo: StaticInfoService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
    // Public because used in template
    public readonly bootstrapService: BootstrapService,
  ) {}

  ngOnInit(): void {
    this.loadRoles().catch(this.logger.error);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addRole() {
    this.router.navigate(['/settings/roles/add']);
  }

  editRole(role: ERole) {
    this.router.navigate(['/settings/roles/edit', role.name]);
  }

  async deleteRole(role: ERole) {
    const pressedButton = await this.dialogService.showDialog({
      title: `Are you sure you want to delete ${role.name}?`,
      description: 'This action cannot be undone.',
      buttons: [
        {
          name: 'cancel',
          text: 'Cancel',
        },
        {
          color: 'warn',
          name: 'delete',
          text: 'Delete',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.rolesService.deleteRole(role.name);
      if (HasFailed(result)) {
        this.errorService.showFailure(result, this.logger);
      } else {
        this.errorService.success('Role deleted');
      }
    }

    await this.loadRoles();
  }

  uiFriendlyPermission(permission: string) {
    return UIFriendlyPermissions[permission as Permission] ?? permission;
  }

  isSystem(role: ERole) {
    return this.UndeletableRolesList.includes(role.name);
  }

  isImmutable(role: ERole) {
    return this.ImmutableRolesList.includes(role.name);
  }

  private async loadRoles() {
    const [roles, specialRoles] = await Promise.all([
      this.rolesService.getRoles(),
      this.staticInfo.getSpecialRoles(),
    ]);
    this.UndeletableRolesList = specialRoles.UndeletableRoles;
    this.ImmutableRolesList = specialRoles.ImmutableRoles;

    if (HasFailed(roles))
      return this.errorService.showFailure(roles, this.logger);
    this.dataSource.data = roles;
  }
}
