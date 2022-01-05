import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, NumericFieldValidator, TextFieldValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;
  fileToUpload: File;
  editImagePath = "assets/images/pro3/noimage.jpg";

  formErrors = {
    name: '',
    title: '',
    isSave: '',
    link: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 3 characters long',
      maxlength: 'Name can not be more than 10 characters long',
      validTextField: 'Name must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title can not be less than 3 characters long',
      maxlength: 'Title can not be more than 10 characters long',
      validTextField: 'Title must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    isSave: {
      required: 'Save value is required',
      minlength: 'Save value can not be less than 3 characters long',
      maxlength: 'Save value can not be more than 10 characters long',
      validNumericField: 'Save value must contains only numbers',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    link: {
      required: 'Link is required',
      minlength: 'Link can not be less than 3 characters long',
      maxlength: 'Link can not be more than 10 characters long',
      validTextField: 'Link must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    }
  };

  @ViewChild('file') elfile: ElementRef;
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        NumericFieldValidator.validNumericField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
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
    this._dataService.get(Global.BASE_APT_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Category Master');
      }
    });
  }

  upload(files: any) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;

    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "Category Master");
      this.elfile.nativeElement.value = "";
      return;
    }

    this.fileToUpload = files[0];
  }

  onSubmit() {
    // debugger;
    if (this.dbops === DbOperation.create && !this.fileToUpload) {
      this._toastr.error("Please upload image !!");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.controls['Id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    formData.append("Title", this.addForm.controls['title'].value);
    formData.append("IsSave", this.addForm.controls['isSave'].value);
    formData.append("Link", this.addForm.controls['link'].value);

    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.postImages(Global.BASE_APT_PATH + "Category/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved Successfully !!", 'Category Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Category Master');
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_APT_PATH + "Category/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated Successfully !!", 'Category Master');
            this.elname.select('Viewtab');
            this.setForm();
          } else {
            this._toastr.error(res.errors[0], 'Category Master');
          }
        });
    }
  }

  setForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.fileToUpload = null;
    this.editImagePath = "assets/images/pro3/noimage.jpg";
  }

  Edit(Id: number) {
    this.dbops = DbOperation.update;
    this.buttonText = "Update";
    this.elname.select('Addtab');
    this.objRow = this.objRows.find(x => x.id === Id);
    this.addForm.controls['Id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.addForm.controls['title'].setValue(this.objRow.title);
    this.addForm.controls['isSave'].setValue(this.objRow.isSave);
    this.addForm.controls['link'].setValue(this.objRow.link);
    this.editImagePath = this.objRow.imagePath;
  }

  Delete(Id: number) {
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_APT_PATH + "Category/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted Successfully !!", 'Category Master');
      } else {
        this._toastr.error(res.errors[0], 'Category Master');
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
    this.fileToUpload = null;
    this.editImagePath = "assets/images/pro3/noimage.jpg";
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objRows = null;
    this.fileToUpload = null;
  }

  onTabChange(event) {
    if (event.activeId == "Addtab") {
      this.addForm.reset({
        Id: 0
      });

      this.dbops = DbOperation.create;
      this.buttonText = "Submit";
      this.fileToUpload = null;
      this.editImagePath = "assets/images/pro3/noimage.jpg";
    }
  }

  onSort(event: any) {
    console.log(event);
  }

  setPage(event: any) {
    console.log(event);
  }

}
