import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-feather-icon',
  templateUrl: './feather-icon.component.html',
  styleUrls: ['./feather-icon.component.scss']
})
export class FeatherIconComponent implements OnInit, AfterViewInit {

  @Input('icon') public feathericon;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    feather.replace();
  }
}
