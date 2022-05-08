import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportedMime } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { ImageService } from 'src/app/services/api/image.service';
import { Logger } from 'src/app/services/logger/logger.service';

@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  private readonly logger: Logger = new Logger('ImagesComponent');

  images: EImage[] | null = null;
  columns = 3;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageService
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;

    let page = Number(params.get('id') ?? '');
    if (isNaN(page)) page = 0;

    const result = await this.imageService.ListImages(24, page);
    if (HasFailed(result)) {
      return this.logger.error(result.getReason());
    }

    this.images = result.images;
  }

  getThumbnailUrl(image: EImage) {
    return (
      this.imageService.GetImageURL(image.id, SupportedMime.QOI) + '?height=480'
    );
  }

  viewImage(image: EImage) {
    this.router.navigate(['/view', image.id]);
  }
}
