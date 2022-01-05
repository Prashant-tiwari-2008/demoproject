import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {
  objRows = [];

  constructor(private _dataService: DataService, private _toastr: ToastrService, private navRoute: Router) { }

  ngOnInit(): void {
    this.getData();
  }


  getData() {
    this._dataService.get(Global.BASE_APT_PATH + "UserMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }

  Edit(Id: number) {
    this.navRoute.navigate(['/users/create-user'], { queryParams: { userId: Id } });
  }

  Delete(Id: number) {
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_APT_PATH + "UserMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted Successfully !!", 'User Master');
      } else {
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }

  ngOnDestroy() {
    this.objRows = null;
  }

}
