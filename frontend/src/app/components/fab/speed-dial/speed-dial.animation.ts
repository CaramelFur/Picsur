import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const SpeedDialAnimation = trigger('speedDialAnimation', [
  transition(':enter', [
    query('[mat-mini-fab]', [
      style({ transform: 'scale(0)' }),
      stagger(-50, [animate(100, style({ transform: 'scale(1)' }))]),
    ]),
  ]),
  transition(':leave', [
    query('[mat-mini-fab]', [
      style({ transform: 'scale(1)' }),
      stagger(50, [animate(150, style({ transform: 'scale(0)' }))]),
    ]),
  ]),
]);
