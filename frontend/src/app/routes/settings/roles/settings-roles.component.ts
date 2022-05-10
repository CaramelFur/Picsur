import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { UIFriendlyPermissions } from 'src/app/i18n/permissions.i18n';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { RolesService } from 'src/app/services/api/roles.service';
import { StaticInfoService } from 'src/app/services/api/static-info.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { BootstrapService } from 'src/app/util/util-module/bootstrap.service';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  templateUrl: './settings-roles.component.html',
  styleUrls: ['./settings-roles.component.scss'],
})
export class SettingsRolesComponent implements OnInit, AfterViewInit {
  private readonly logger = new Logger('SettingsRolesComponent');

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
    private utilService: UtilService,
    private rolesService: RolesService,
    private staticInfo: StaticInfoService,
    private router: Router,
    public bootstrapService: BootstrapService
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
    const pressedButton = await this.utilService.showDialog({
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
        this.utilService.showSnackBar(
          'Failed to delete role',
          SnackBarType.Error
        );
      } else {
        this.utilService.showSnackBar('Role deleted', SnackBarType.Success);
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

    if (HasFailed(roles)) {
      this.utilService.showSnackBar('Failed to load roles', SnackBarType.Error);
      return;
    }
    this.dataSource.data = roles;
  }
}
