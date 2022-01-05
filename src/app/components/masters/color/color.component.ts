import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, TextFieldValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;

  formErrors = {
    name: '',
    code: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 3 characters long',
      maxlength: 'Name can not be more than 10 characters long',
      validTextField: 'Name must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    code: {
      required: 'Name is required',
      minlength: 'Name can not be less than 3 characters long',
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
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
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
    this._dataService.get(Global.BASE_APT_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Color Master');
      }
    });
  }


  onSubmit() {
    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_APT_PATH + "ColorMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved Successfully !!", 'Color Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Color Master');
          }
        });
        break;
      case DbOperation.update:
        this._dataService.post(Global.BASE_APT_PATH + "ColorMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated Successfully !!", 'Color Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Color Master');
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
    this.addForm.controls['code'].setValue(this.objRow.code);
  }

  Delete(Id: number) {
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_APT_PATH + "ColorMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted Successfully !!", 'Color Master');
      } else {
        this._toastr.error(res.errors[0], 'Color Master');
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
