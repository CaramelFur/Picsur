import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { isHash } from 'class-validator';
import { HasFailed } from 'picsur-shared/dist/types';
import { ImageService } from 'src/app/api/image.service';
import { ImageLinks } from 'picsur-shared/dist/dto/imagelinks.dto';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService
  ) {}

  public imageUrl: string;
  public imageLinks: ImageLinks;

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;
    const hash = params.get('hash') ?? '';
    if (!isHash(hash, 'sha256')) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    const imageMeta = await this.imageService.GetImageMeta(hash);
    if (HasFailed(imageMeta)) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    this.imageUrl = this.imageService.GetImageURL(hash);
    this.imageLinks = this.imageService.CreateImageLinks(this.imageUrl);
  }
}
