import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
  standalone: false,
})
export class NavigationHeaderComponent  implements OnInit {

  @Input() titulo: string | undefined;

  constructor() { }

  ngOnInit() {}
}
