import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, TextFieldValidator } from 'src/app/validations/validations.validator';


@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit , OnDestroy {
  addForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;

  formErrors = {
    name: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 1 characters long',
      maxlength: 'Name can not be more than 10 characters long',
      validTextField: 'Name must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    }
  };

  @ViewChild('tabset') elname: any;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.addForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])]
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });
  }

  get f() {
    return this.addForm.controls;
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.addForm.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }

  getData() {
    this._dataService.get(Global.BASE_APT_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Size Master');
      }
    });
  }


  onSubmit() {
    debugger;
    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_APT_PATH + "SizeMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved Successfully !!", 'Size Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Size Master');
          }
        });
        break;
      case DbOperation.update:
        this._dataService.post(Global.BASE_APT_PATH + "SizeMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated Successfully !!", 'Size Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Size Master');
          }
        });
    }
  }

  setForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
  }

  Edit(Id: number) {
    this.dbops = DbOperation.update;
    this.buttonText = "Update";
    this.elname.select('Addtab');
    this.objRow = this.objRows.find(x => x.id === Id);
    this.addForm.controls['Id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
  }

  Delete(Id: number) {
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_APT_PATH + "SizeMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted Successfully !!", 'Size Master');
      } else {
        this._toastr.error(res.errors[0], 'Size Master');
      }
    });
  }

  cancelForm() {
    this.addForm.reset({
      Id: 0
    });

    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select("Viewtab");
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objRows = null;
  }

  onTabChange(event) {
    if (event.activeId == "Addtab") {
      this.addForm.reset({
        Id: 0
      });

      this.dbops = DbOperation.create;
      this.buttonText = "Submit";
    }
  }

  onSort(event: any) {
    console.log(event);
  }

  setPage(event: any) {
    console.log(event);
  }

}
