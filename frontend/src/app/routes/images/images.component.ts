import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  merge,
  switchMap,
  timer,
} from 'rxjs';
import { ImageService } from '../../services/api/image.service';
import { UserService } from '../../services/api/user.service';
import { Logger } from '../../services/logger/logger.service';
import { BSScreenSize, BootstrapService } from '../../util/bootstrap.service';
import { DialogService } from '../../util/dialog-manager/dialog.service';
import { ErrorService } from '../../util/error-manager/error.service';

@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  private readonly logger: Logger = new Logger(ImagesComponent.name);

  imagesSub = new BehaviorSubject<EImage[] | null>(null);
  columns = 1;

  public get images() {
    const value = this.imagesSub.value;
    return (
      value?.filter(
        (i) => i.expires_at === null || i.expires_at > new Date(),
      ) ?? null
    );
  }

  page = 1;
  pages = 1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bootstrapService: BootstrapService,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.load().catch(this.logger.error);
  }

  private async load() {
    const params = this.route.snapshot.paramMap;

    let thispage = Number(params.get('page') ?? '');
    if (isNaN(thispage) || thispage <= 0) thispage = 1;
    this.page = thispage;

    this.subscribeMobile();
    this.subscribeUser();
    this.subscribeImages();
  }

  @AutoUnsubscribe()
  private subscribeMobile() {
    return this.bootstrapService.screenSize().subscribe((size) => {
      if (size <= BSScreenSize.sm) {
        this.columns = 1;
      } else if (size <= BSScreenSize.lg) {
        this.columns = 2;
      } else {
        this.columns = 3;
      }
    });
  }

  @AutoUnsubscribe()
  private subscribeUser() {
    return this.userService.live.subscribe(async (user) => {
      if (user === null) return;

      const list = await this.imageService.ListMyImages(24, this.page - 1);
      if (HasFailed(list)) {
        return this.logger.error(list.getReason());
      }

      this.pages = list.pages;
      this.imagesSub.next(list.results);
    });
  }

  @AutoUnsubscribe()
  private subscribeImages() {
    // Make sure we only get populated images
    const filteredImagesSub: Observable<EImage[]> = this.imagesSub.pipe(
      filter((images) => images !== null),
    ) as Observable<EImage[]>;

    const mappedImagesSub: Observable<EImage> = filteredImagesSub.pipe(
      // Everytime we get a new array, we want merge a mapping of that array
      // In this mapping, each image will emit itself on the expire date
      switchMap((images: EImage[]) =>
        merge(
          ...images
            .filter((i) => i.expires_at !== null)
            .map((i) => timer(i.expires_at ?? new Date(0)).pipe(map(() => i))),
        ),
      ),
    ) as Observable<EImage>;

    return mappedImagesSub.subscribe((image) => {
      this.imagesSub.next(
        this.images?.filter((i) => i.id !== image.id) ?? null,
      );
    });
  }

  getThumbnailUrl(image: EImage) {
    return (
      this.imageService.GetImageURL(image.id, ImageFileType.QOI) +
      '?height=480&shrinkonly=yes'
    );
  }

  viewImage(image: EImage) {
    this.router.navigate(['/view', image.id]);
  }

  async deleteImage(image: EImage) {
    const pressedButton = await this.dialogService.showDialog({
      title: `Are you sure you want to delete the image?`,
      description: 'This action cannot be undone.',
      buttons: [
        {
          name: 'cancel',
          text: 'Cancel',
        },
        {
          color: 'warn',
          name: 'delete',
          text: 'Delete',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.imageService.DeleteImage(image.id ?? '');
      if (HasFailed(result))
        return this.errorService.showFailure(result, this.logger);

      this.errorService.success('Image deleted');
      this.imagesSub.next(
        this.images?.filter((i) => i.id !== image.id) ?? null,
      );
    }
  }

  gotoPage(page: number) {
    this.router.navigate(['/images', page]).then(() => {
      this.load().catch(this.logger.error);
    });
  }
}
