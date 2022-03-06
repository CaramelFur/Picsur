import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { UserService } from 'src/app/api/user.service';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { UtilService } from 'src/app/util/util.service';
import { LoginControl } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model = new LoginControl();
  loginFail = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  async onSubmit() {
    const data = this.model.getData();
    if (HasFailed(data)) {
      return;
    }

    const user = await this.userService.login(data.username, data.password);
    if (HasFailed(user)) {
      console.warn(user);
      this.loginFail = true;
      return;
    }

    this.utilService.showSnackBar('Login successful', SnackBarType.Success);
    this.router.navigate(['/']);
  }
}
