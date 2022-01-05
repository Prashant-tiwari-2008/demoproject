import { Component, OnInit } from '@angular/core';
import { Global } from '../../global';
import { Menu, NavService } from '../../services/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: Menu[];
  fullName: string;
  userType: string;
  imagePath: string = "assets/images/user.png";

  constructor(public _navService: NavService) {
    this.menuItems = _navService.MENUITEMS;
  }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    this.userType = userDetails.userType;
    this.imagePath = ( userDetails.imagePath != null &&  userDetails.imagePath != "") ? Global.BASE_USER_IMAGES_PATH + userDetails.imagePath :"assets/images/user.png";
  }

  // for toggle menu link
  toggleNavActive(item: any) {
    item.active = !item.active;
  }

}
