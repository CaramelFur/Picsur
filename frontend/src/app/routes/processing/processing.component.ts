import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessingViewMetadata } from 'src/app/models/processing-view-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Component({
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss'],
})
export class ProcessingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state as ProcessingViewMetadata;
    if (!state) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    console.log(state);
  }
}
