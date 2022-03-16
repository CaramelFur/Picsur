import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  Router
} from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { PRouteData } from './models/picsur-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly logger = console;

  @ViewChild(MatSidenav) snav: MatSidenav;

  containerWrap: boolean = true;
  sidebarPortal: Portal<any> | undefined = undefined;

  isMobile: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakPointObserver: BreakpointObserver
  ) {}

  private get routeData(): PRouteData {
    return this.activatedRoute.firstChild?.snapshot.data ?? {};
  }

  ngOnInit() {
    this.subscribeRouter();
    this.subscribeMobile();
  }

  @AutoUnsubscribe()
  private subscribeRouter() {
    return this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.onNavigationEnd(event);
      if (event instanceof NavigationError) this.onNavigationError(event);
    });
  }

  @AutoUnsubscribe()
  private subscribeMobile() {
    return this.breakPointObserver
      .observe(['(min-width: 576px)']) // Bootstrap breakpoints
      .subscribe((state) => {
        this.isMobile = !state.matches;
      });
  }

  private onNavigationEnd(event: NavigationEnd) {
    this.reset();

    const data = this.routeData;
    this.containerWrap = !data.noContainer;
    if (data.sidebar !== undefined)
      this.sidebarPortal = new ComponentPortal(data.sidebar);

    console.log(data)
  }

  private onNavigationError(event: NavigationError) {
    const error: Error = event.error;
    if (error.message.startsWith('Cannot match any routes'))
      this.router.navigate(['/pagenotfound']);
  }

  private reset() {
    this.containerWrap = true;
    this.sidebarPortal = undefined;
  }
}
