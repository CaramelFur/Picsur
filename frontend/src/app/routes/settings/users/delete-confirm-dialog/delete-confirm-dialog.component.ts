import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { UserManageService } from 'src/app/services/api/usermanage.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
})
export class DeleteConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EUser,
    private userManageService: UserManageService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    console.log('Dialog', this.data);
  }

  async onDelete() {
    const result = await this.userManageService.deleteUser(this.data.username);
    if (HasFailed(result)) {
      this.utilService.showSnackBar(
        'Failed to delete user',
        SnackBarType.Error
      );
    } else {
      this.utilService.showSnackBar('User deleted', SnackBarType.Success);
    }

    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
