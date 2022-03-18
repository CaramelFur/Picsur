import { BreakpointObserver } from '@angular/cdk/layout';
import { Portal } from '@angular/cdk/portal';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
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
  readonly logger = console;

  @ViewChild(MatSidenav) sidebar: MatSidenav;

  containerWrap: boolean = true;
  sidebarPortal: Portal<any> | undefined = undefined;

  isDesktop: boolean = false;
  hasSidebar: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakPointObserver: BreakpointObserver,
    private injector: Injector
  ) {}

  private get routeData(): PRouteData {
    let currentRoute: ActivatedRoute | null = this.activatedRoute;
    let accumulate: PRouteData = {};
    while (currentRoute !== null) {
      const data = currentRoute.snapshot.data;
      if (data !== undefined) {
        accumulate = {
          ...accumulate,
          ...data,
        };
      }
      currentRoute = currentRoute.firstChild;
    }
    return accumulate;
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
        this.isDesktop = state.matches;
        this.updateSidebar();
      });
  }

  onHamburgerClick() {
    this.sidebar.toggle();
  }

  private async onNavigationError(event: NavigationError) {
    const error: Error = event.error;
    if (error.message.startsWith('Cannot match any routes'))
      this.router.navigate(['/error/404'], { replaceUrl: true });
  }

  private async onNavigationEnd(event: NavigationEnd) {
    const data = this.routeData;
    this.containerWrap = !data.noContainer;

    console.log(data);

    if (data._sidebar_portal !== undefined) {
      this.sidebarPortal = data._sidebar_portal;
      this.hasSidebar = true;
    } else {
      this.hasSidebar = false;
    }
    this.updateSidebar();
  }

  private updateSidebar() {
    if (!this.sidebar) return;

    if (
      this.sidebarPortal === undefined ||
      !this.hasSidebar ||
      !this.isDesktop
    ) {
      this.sidebar.opened = false;
    } else {
      this.sidebar.opened = true;
    }
  }
}
