import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  Router
} from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly logger = console;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  @AutoUnsubscribe()
  ngOnInit() {
    return this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.onNavigationEnd(event);
      if (event instanceof NavigationError) this.onNavigationError(event);
    });
  }

  onNavigationEnd(event: NavigationEnd) {
    const data = this.activatedRoute.snapshot.data;
    console.log('New:', data);
  }

  onNavigationError(event: NavigationError) {
    const error: Error = event.error;
    if (error.message.startsWith('Cannot match any routes'))
      this.router.navigate(['/pagenotfound']);
  }
}
