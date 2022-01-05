import { Injectable } from '@angular/core';

export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  children?: Menu[]
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  collapseSidebar: boolean = false;

  constructor() { }

  MENUITEMS: Menu[] = [
    { path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', active: true },
    {
      title: 'Products', icon: 'box', type: 'sub', active: false, children: [
        {
          title: 'Physical', type: 'sub', children: [
            { path: '/products/physical/product-list', type: 'link', title: 'Product List' },
            { path: '/products/physical/add-product', type: 'link', title: 'Add Product' }
          ]
        }
      ]
    },

    {
      title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
        { path: '/sales/orders', type: 'link', title: 'Orders' },
        { path: '/sales/transactions', type: 'link', title: 'Transactions' }
      ]
    },

    {
      title: 'Masters', icon: 'clipboard', type: 'sub', active: false, children: [
        { path: '/masters/brandlogo', type: 'link', title: 'Brand Logo' },
        { path: '/masters/category', type: 'link', title: 'Category' },
        { path: '/masters/color', type: 'link', title: 'Color' },
        { path: '/masters/tag', type: 'link', title: 'Tag' },
        { path: '/masters/size', type: 'link', title: 'Size' },
        { path: '/masters/usertype', type: 'link', title: 'User Type' }
      ]
    },

    {
      title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
        { path: '/users/list-user', type: 'link', title: 'User List' },
        { path: '/users/create-user', type: 'link', title: 'Create User' }
      ]
    },

    { path: '/reports', title: 'Reports', icon: 'bar-chart', active: false, type: 'link' },

    {
      title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
        { path: '/settings/profile', type: 'link', title: 'Profile' }
      ]
    },

    { path: '/invoice', title: 'Invoice', icon: 'archive', active: false, type: 'link' },

    { path: '/auth/login', title: 'Logout', icon: 'log-out', active: false, type: 'link' }

  ];
}
