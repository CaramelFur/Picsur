import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { InfoService } from 'src/app/services/api/info.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private infoService: InfoService) {}

  isDemo: boolean = false;
  version: string = 'V0.0.0';

  ngOnInit(): void {
    this.subscribeInfo();
  }

  @AutoUnsubscribe()
  subscribeInfo() {
    return this.infoService.live.subscribe((info) => {
      this.isDemo = info.demo;
      this.version = 'V' + info.version;
    });
  }
}
