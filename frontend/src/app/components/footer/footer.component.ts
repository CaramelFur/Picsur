import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { InfoService } from 'src/app/services/api/info.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  constructor(
    private readonly infoService: InfoService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  isDemo: boolean = false;
  version: string = 'Unkown Version';

  ngOnInit(): void {
    this.subscribeInfo();
  }

  @AutoUnsubscribe()
  subscribeInfo() {
    return this.infoService.live.subscribe((info) => {
      this.isDemo = info.demo;
      this.version = 'V' + info.version;
      this.changeDetector.markForCheck();
    });
  }
}
