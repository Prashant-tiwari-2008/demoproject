import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { MustMatchValidator } from 'src/app/validations/validations.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  strMsg: string;
  submitted: boolean = false;

  @ViewChild('tabset') elname: any;

  constructor(private _authService: AuthService, private _dataService: DataService,
    private _fb: FormBuilder, private _toastr: ToastrService) {
    this.strMsg = "";
    this._authService.logout();
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();
  }
  createLoginForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  createRegisterForm() {
    this.registerForm = this._fb.group({
      Id: [0],
      FirstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      LastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      Email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])], // Not an right pattern
      UserTypeId: [1],
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      }

    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onLoginSubmit() {
    if (this.loginForm.get('userName').value == "") {
      this._toastr.error("UserName is required !!", "Login");
      return;
    } else if (this.loginForm.get('password').value == "") {
      this._toastr.error("Password is required !!", "Login");
      return;
    }
    else {
      if (this.loginForm.valid) {
        this._dataService.post(Global.BASE_APT_PATH + "UserMaster/Login/", this.loginForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._authService.login(res.data);
            this.strMsg = this._authService.getMessaage();
            if (this.strMsg !== "") {
              this._toastr.error(this.strMsg, "Login");
              this.reset();
            }
          } else {
            this._toastr.error("Invalid Credentials !!", "Login");
            this.reset();
          }
        });
      } else {
        this._toastr.error("Invalid Credentials !!", "Login");
        this.reset();
      }
    }

  }

  reset() {
    //this.loginForm.reset();
    this.loginForm.controls['userName'].setValue("");
    this.loginForm.controls['password'].setValue("");
  }

  onSubmit(formData: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this._dataService.post(Global.BASE_APT_PATH + "UserMaster/Save/", formData.value).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Data Saved Successfully !!", "Register");
        this.registerForm.reset();
        this.submitted = false;
        this.elname.select("logintab");
      } else {
        this._toastr.error(res.errors[0], "Register");
      }
    });

  }

}
