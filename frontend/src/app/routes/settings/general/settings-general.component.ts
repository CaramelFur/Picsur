import { Component, OnInit } from '@angular/core';
import { UsrPrefService } from 'src/app/services/api/usrpref.service';

@Component({
  templateUrl: './settings-general.component.html',
})
export class SettingsGeneralComponent implements OnInit {
  constructor(public userPref: UsrPrefService) {}

  ngOnInit(): void {}
}
