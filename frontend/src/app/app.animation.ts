import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

// This shit worked so beautifully on firefox, but then chrome and angular had to come along and fuck it up
// Because yes, chrome of course doesnt apply the opacity of an 'diplay: inline' element to its children.
// Not so difficult right, just change the display to block or something?
// Yes difficult, because of course the elements I need to apply it to, are all angular components.
// I could manually add the css to every component, but that is the most stupid solution ever.
// Maybe there is just an option to change that in angular itself?
// Because putting 'block' elements inside 'inline' elements isnt even allowed per spec,
//   surely angular would allow you to follow spec?
// But no, of course not, having reasonable config options is stupid.
// The only thing it allows you to do is automatically add the 'display: block' property to every new element with schematics
// And every single issue that tries to properly fix this bug gets closed with this previous "solution" as answer.
// It sooo fucking stupid.
// Now I've just applied block to all the siblings of the router, since those are the only components that REALLY need it.
// But I still think its a stupid solution.

// Also, why the fuck doesnt 'display: none' work?
// I'll just use this weird ass 'position: absolute' thingy for now.

export const RouteTransitionAnimations = trigger('mainAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          top: '-100%',
          width: '0',
          display: 'none',
        }),
      ],
      {
        optional: true,
      },
    ),

    query(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('.1s', style({ opacity: 0 })),
        style({
          position: 'absolute',
          top: '-100%',
          width: '0',
          display: 'none',
        }),
      ],
      { optional: true },
    ),

    query(
      ':enter',
      [
        style({
          opacity: 0,
          display: 'block',
          position: 'revert',
          width: 'revert',
        }),
        animate('.1s', style({ opacity: 1 })),
      ],
      { optional: true },
    ),
  ]),
]);
