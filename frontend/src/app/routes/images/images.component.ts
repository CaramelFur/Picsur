import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SupportedMime } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { ImageService } from 'src/app/services/api/image.service';
import { Logger } from 'src/app/services/logger/logger.service';
import {
  BootstrapService,
  BSScreenSize,
} from 'src/app/util/util-module/bootstrap.service';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  private readonly logger: Logger = new Logger('ImagesComponent');

  @ViewChildren('column')
  columnsChild: QueryList<ElementRef<HTMLDivElement>>;

  sourceImages: EImage[] | null = null;
  private elementSizes: { [key: string]: number } = {};
  private elements: { [key: string]: HTMLElement } = {};
  private desiredColumns = 1;

  images: EImage[][] | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bootstrapService: BootstrapService,
    private readonly imageService: ImageService
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;

    let page = Number(params.get('id') ?? '');
    if (isNaN(page)) page = 0;

    this.subscribeMobile();

    const result = await this.imageService.ListImages(24, page);
    if (HasFailed(result)) {
      return this.logger.error(result.getReason());
    }

    this.sourceImages = result.images;
    this.sortMasonryRender();
  }

  @AutoUnsubscribe()
  private subscribeMobile() {
    return this.bootstrapService.screenSize().subscribe((size) => {
      if (size <= BSScreenSize.sm) {
        this.desiredColumns = 1;
      } else if (size <= BSScreenSize.lg) {
        this.desiredColumns = 2;
      } else {
        this.desiredColumns = 3;
      }
      this.sortMasonryRender();
    });
  }

  private sortMasonryRender() {
    if (!this.sourceImages) {
      this.images = null;
      return;
    }

    this.elements = {};
    this.elementSizes = {};

    const columnSizes: number[] = [];
    const columns: EImage[][] = [];
    for (let i = 0; i < this.desiredColumns; i++) {
      columnSizes.push(0);
      columns.push([]);
    }

    for (let i = 0; i < this.sourceImages.length; i++) {
      columns[i % this.desiredColumns].push(this.sourceImages[i]);
    }

    this.images = columns;
  }

  private sortMasonry() {
    if (!this.sourceImages) {
      this.images = null;
      return;
    }

    const elementImages = this.sourceImages.map((img) => ({
      element: this.elements[img.id],
      height: this.elementSizes[img.id],
    }));
    if (
      elementImages.find(
        (test) => test.element === undefined || test.height === undefined
      ) !== undefined
    ) {
      return;
    }

    for (let { element } of elementImages) {
      element.parentElement?.removeChild(element);
    }

    const columnSizes: number[] = this.columnsChild.map((column) => 0);
    for (let i = 0; i < elementImages.length; i++) {
      const { element, height } = elementImages[i];

      let minColumn = 0;
      let minColumnSize = columnSizes[0];
      for (let j = 0; j < columnSizes.length; j++) {
        const distributed_j = (j + i) % columnSizes.length;

        const columnSize = columnSizes[distributed_j];
        if (columnSize <= minColumnSize) {
          minColumn = distributed_j;
          minColumnSize = columnSize;
        }
      }

      this.columnsChild.toArray()[minColumn].nativeElement.appendChild(element);
      columnSizes[minColumn] += height;
    }
  }

  getThumbnailUrl(image: EImage) {
    return (
      this.imageService.GetImageURL(image.id, SupportedMime.QOI) + '?height=480'
    );
  }

  viewImage(image: EImage) {
    this.router.navigate(['/view', image.id]);
  }

  onResize(
    [event]: ResizeObserverEntry[],
    image: EImage,
    element: HTMLElement
  ) {
    this.elements[image.id] = element;

    if (this.elementSizes[image.id] !== event.contentRect.height) {
      this.elementSizes[image.id] = event.contentRect.height;
      this.sortMasonry();
    }
  }
}
