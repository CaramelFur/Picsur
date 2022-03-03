import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/api/user.service';
import { LoginControl } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  model = new LoginControl();
  loginFail = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log('init');
    this.userSubscription = this.userService.user.subscribe((user) => {
      console.log('sub', user);
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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

    this.router.navigate(['/']);
  }
}
