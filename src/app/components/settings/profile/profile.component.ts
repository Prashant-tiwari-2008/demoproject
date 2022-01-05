import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  fullName: string;
  firstName: string;
  lastName: string;
  emailId: string;
  imagePath: string = "assets/images/user.png";
  userDetails: any;
  fileToUpload: File;
  @ViewChild('file') elfile: ElementRef;
  @ViewChild('tabset') elname: any;
  constructor(private _dataService: DataService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.fullName = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.emailId = this.userDetails.email;
    this.imagePath = ( this.userDetails.imagePath != null &&  this.userDetails.imagePath != "") ? Global.BASE_USER_IMAGES_PATH + this.userDetails.imagePath :"assets/images/user.png";
  }


  upload(files: any) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;

    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "Brand Logo Master");
      this.elfile.nativeElement.value = "";
      return;
    }

    this.fileToUpload = files[0];
  }


  onSubmit() {
    if (!this.fileToUpload) {
      this._toastr.error("Please upload image !!", "Profile Master");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.userDetails.id);

    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    this._dataService.postImages(Global.BASE_APT_PATH + "UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Profile has been updated Successfully !!", 'Profile Master');
        this.elname.select('Viewtab');
        this.elfile.nativeElement.value = "";
        this.router.navigate(['auth/login']);
      } else {
        this._toastr.error(res.errors[0], 'Profile Master');
      }
    });
  }
}
