import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  open: boolean = false;
  openNav: boolean = false;

  constructor(public _navService: NavService) { }

  ngOnInit(): void {
  }
  // Need to explain
  collapseSidebar() {
    this.open = !this.open;
    this._navService.collapseSidebar = !this._navService.collapseSidebar;
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }
}
