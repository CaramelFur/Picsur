import { Component, OnInit } from '@angular/core';

type SideBarRoute = {
  type: 'personal' | 'system';
  path: string;
  name: string;
  icon: string;
};

const SideBarRoutes: SideBarRoute[] = [
  {
    type: 'personal',
    path: '',
    name: 'General',
    icon: 'settings',
  },
];

@Component({
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit {
  personalRoutes: SideBarRoute[] = [];
  systemRoutes: SideBarRoute[] = [];

  constructor() {}

  ngOnInit() {
    const routes = SideBarRoutes.map((route) => {
      return {
        ...route,
        path: `/settings/${route.path}`,
      };
    });

    this.personalRoutes = routes.filter((route) => route.type === 'personal');
    this.systemRoutes = routes.filter((route) => route.type === 'system');
  }
}
