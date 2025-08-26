import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  standalone: false,
})
export class PopoverComponent implements OnInit {
  
  @Input() data: any;

  constructor() { }

  ngOnInit() { }

}
