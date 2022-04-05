import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageLinks } from 'picsur-shared/dist/dto/imagelinks.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SHA256 } from 'picsur-shared/dist/util/common-regex';
import { ImageService } from 'src/app/services/api/image.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private utilService: UtilService
  ) {}

  public imageUrl: string = '';
  public imageLinks = new ImageLinks();

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;
    const hash = params.get('hash') ?? '';
    if (!SHA256.test(hash)) {
      return this.utilService.quitError('Invalid image link');
    }

    const imageMeta = await this.imageService.GetImageMeta(hash);
    if (HasFailed(imageMeta)) {
      return this.utilService.quitError(imageMeta.getReason());
    }

    this.imageUrl = this.imageService.GetImageURL(hash);
    this.imageLinks = this.imageService.CreateImageLinks(this.imageUrl);
  }

  goBackHome() {
    this.router.navigate(['/']);
  }
}
