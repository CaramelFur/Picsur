import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss'],
})
export class SettingsHomeComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit(): void {
    console.log('AdminComponent');
  }
}
