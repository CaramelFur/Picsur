import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { UIFriendlyPermissions } from 'src/app/i18n/permissions.i18n';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { RolesService } from 'src/app/services/api/roles.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  templateUrl: './settings-roles.component.html',
  styleUrls: ['./settings-roles.component.scss'],
})
export class SettingsRolesComponent implements OnInit, AfterViewInit {
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
    private rolesService: RolesService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRoles().catch(console.error);
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
          color: 'red',
          name: 'delete',
          text: 'Delete',
        },
        {
          color: 'primary',
          name: 'cancel',
          text: 'Cancel',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.rolesService.deleteRole(role.name);
      if (HasFailed(result)) {
        this.utilService.showSnackBar(
          'Failed to delete user',
          SnackBarType.Error
        );
      } else {
        this.utilService.showSnackBar('User deleted', SnackBarType.Success);
      }
    }

    await this.fetchRoles();
  }

  uiFriendlyPermission(permission: string) {
    return UIFriendlyPermissions[permission];
  }

  isSystem(role: ERole) {
    return this.UndeletableRolesList.includes(role.name);
  }

  isImmutable(role: ERole) {
    return this.ImmutableRolesList.includes(role.name);
  }

  private async fetchRoles() {
    const roles = await this.rolesService.getRoles();
    if (HasFailed(roles)) {
      this.utilService.showSnackBar('Failed to load roles', SnackBarType.Error);
      return;
    }

    this.dataSource.data = roles;

    const specialRoles = await this.rolesService.getSpecialRoles();
    if (HasFailed(specialRoles)) {
      this.utilService.showSnackBar(
        'Failed to load special roles',
        SnackBarType.Error
      );
      return;
    }

    this.UndeletableRolesList = specialRoles.UndeletableRoles;
    this.ImmutableRolesList = specialRoles.ImmutableRoles;
  }
}
