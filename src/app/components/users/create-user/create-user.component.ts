import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { MustMatchValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  dbops: DbOperation;
  buttonText: string;
  registerForm: FormGroup;
  submitted: boolean = false;
  objUserTypes = [];
  objRow: any;
  userId: number = 0;

  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService,
    private navRoute: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      //this.userId = params.userId;
    })
  }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";

    this.registerForm = this._fb.group({
      Id: [0],
      FirstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      LastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      Email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])], // Not an right pattern
      userTypeId: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      }

    );
  }
  ngOnInit() {
    this.setFormState();
    this.getUserType();

    if (this.userId != null && this.userId > 0) {
      this.dbops = DbOperation.update;
      this.buttonText = "Update";
      this.getUserById();
    }
  }


  get f() {
    return this.registerForm.controls;
  }

  getUserById() {
    debugger;
    this._dataService.get(Global.BASE_APT_PATH + "UserMaster/GetbyId/" + this.userId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.registerForm.controls['Id'].setValue(this.objRow.id);
        this.registerForm.controls['FirstName'].setValue(this.objRow.firstName);
        this.registerForm.controls['LastName'].setValue(this.objRow.lastName);
        this.registerForm.controls['Email'].setValue(this.objRow.email);
        this.registerForm.controls['userTypeId'].setValue(this.objRow.userTypeId);
      } else {
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }

  getUserType() {
    this._dataService.get(Global.BASE_APT_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }

  onSubmit(formData: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_APT_PATH + "UserMaster/Save/", formData.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Account has been created Successfully !!", "User Master");
            this.registerForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "User Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.post(Global.BASE_APT_PATH + "UserMaster/Update/", formData.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Account has been updated Successfully !!", "User Master");
            this.registerForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "User Master");
          }
        });
        break;
    }
  }

  ngOnDestroy() {
    this.objUserTypes = null;
    this.objRow = null;
  }
}
