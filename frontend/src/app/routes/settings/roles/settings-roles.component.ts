import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Permission,
  UIFriendlyPermissions
} from 'picsur-shared/dist/dto/permissions';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private rolesService: RolesService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.initRoles().catch(console.error);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async initRoles() {
    const roles = await this.rolesService.getRoles();
    if (HasFailed(roles)) {
      this.utilService.showSnackBar('Failed to load roles', SnackBarType.Error);
      return;
    }

    this.dataSource.data = roles;
  }

  addRole() {}

  editRole(role: ERole) {}

  deleteRole(role: ERole) {}

  uiFriendlyPermission(permission: Permission) {
    return UIFriendlyPermissions[permission];
  }

  isSystem(role: ERole) {
    return false;
  }
}
