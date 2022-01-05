import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, NumericFieldValidator, TextFieldValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  submitted: boolean = false;
  dbops: DbOperation;
  productId: number = 0;
  productForm: FormGroup;
  counter: number = 1;
  objRow: any;
  bigImage = "assets/images/pro3/noimage.jpg";
  url = [
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" }
  ];

  buttonText: string = "";
  fileTobeUpload = [];
  objSizes = [];
  objCategories = [];
  objTags = [];
  objColors = [];

  @ViewChild('file') elfiles: ElementRef;
  formErrors = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    categoryId: '',
    tagId: '',
    colorId: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 1 characters long',
      maxlength: 'Name cannot be more than 10 characters long',
      validTextField: 'Name must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less than 1 characters long',
      maxlength: 'Title cannot be more than 10 characters long',
      validTextField: 'Title must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    code: {
      required: 'Code is required',
      minlength: 'Code cannot be less than 1 characters long',
      maxlength: 'Code cannot be more than 10 characters long',
      validTextField: 'Code must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    price: {
      required: 'Price is required',
      minlength: 'Price cannot be less than 1 characters long',
      maxlength: 'Price cannot be more than 10 characters long',
      validNumericField: 'Price must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    salePrice: {
      required: 'Sale Price is required',
      minlength: 'Sale Price cannot be less than 1 characters long',
      maxlength: 'Sale Price cannot be more than 10 characters long',
      validNumericField: 'Sale Price must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    discount: {
      required: 'Discount is required',
      minlength: 'Discount cannot be less than 1 characters long',
      maxlength: 'Discount cannot be more than 10 characters long',
      validNumericField: 'Discount must contains only numbers and latters',
      noWhiteSpcaeValidator: 'Only white space is not allowed'
    },
    sizeId: {
      required: 'Size is required'
    },
    categoryId: {
      required: 'Category is required'
    },
    tagId: {
      required: 'Tag is required'
    },
    colorId: {
      required: 'Color is required'
    }
  };


  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService
    , private route: ActivatedRoute, private navRoute: Router) {
    if (this.navRoute.getCurrentNavigation().extras.state) {
      this.productId = this.navRoute.getCurrentNavigation().extras.state.productId;
    }
  }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.productForm = this._fb.group({
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
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      sizeId: ['', Validators.required],
      categoryId: ['', Validators.required],
      tagId: ['', Validators.required],
      colorId: ['', Validators.required],
      quantity: [''],
      isSale: [''],
      isNew: [''],
      shortDetails: [''],
      description: ['']
    });

    this.productForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.productForm.controls['quantity'].setValue(1);
  }

  get f() {
    return this.productForm.controls;
  }



  onValueChanged() {
    if (!this.productForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.productForm.get(field);

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

  ngOnInit(): void {
    this.setFormState();
    this.getCategories();
    this.getColors();
    this.getSizes();
    this.getTags();

    if (this.productId != null && this.productId > 0) {
      this.dbops = DbOperation.update;
      this.buttonText = "Update";
      this.getProductById();
    }
  }

  increment() {
    this.counter = this.counter + 1;
    this.productForm.controls['quantity'].setValue(this.counter);

  }
  decrement() {
    this.counter = this.counter - 1;
    this.productForm.controls['quantity'].setValue(this.counter);
  }


  readUrl(event: any, i: number) {
    if (event.target.files.Length === 0) {
      return;
    }

    this.fileTobeUpload[i] = event.target.files[0];

    let type = event.target.files[0].type;

    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "Brand Logo Master");
      this.elfiles.nativeElement.value = "";
      return;
    }

    // Image Upload show
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.url[i].img = reader.result.toString();
    }
  }
  getProductById() {
    this._dataService.get(Global.BASE_APT_PATH + "ProductMaster/GetbyId/" + this.productId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.productForm.controls['Id'].setValue(this.objRow.id);
        this.productForm.controls['name'].setValue(this.objRow.name);
        this.productForm.controls['code'].setValue(this.objRow.code);
        this.productForm.controls['title'].setValue(this.objRow.title);
        this.productForm.controls['price'].setValue(this.objRow.price);
        this.productForm.controls['salePrice'].setValue(this.objRow.salePrice);
        this.productForm.controls['discount'].setValue(this.objRow.discount);
        this.productForm.controls['sizeId'].setValue(this.objRow.sizeId);
        this.productForm.controls['categoryId'].setValue(this.objRow.categoryId);
        this.productForm.controls['tagId'].setValue(this.objRow.tagId);
        this.productForm.controls['colorId'].setValue(this.objRow.colorId);
        this.productForm.controls['quantity'].setValue(this.objRow.quantity);
        this.productForm.controls['isSale'].setValue(this.objRow.isSale);
        this.productForm.controls['isNew'].setValue(this.objRow.isNew);
        this.productForm.controls['shortDetails'].setValue(this.objRow.shortDetails);
        this.productForm.controls['description'].setValue(this.objRow.description);

        this._dataService.get(Global.BASE_APT_PATH + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              this.url = [
                { img: res.data[0] != null ? Global.BASE_IMAGES_PATH + res.data[0].name : "assets/images/user.png" },
                { img: res.data[1] != null ? Global.BASE_IMAGES_PATH + res.data[1].name : "assets/images/user.png" },
                { img: res.data[2] != null ? Global.BASE_IMAGES_PATH + res.data[2].name : "assets/images/user.png" },
                { img: res.data[3] != null ? Global.BASE_IMAGES_PATH + res.data[3].name : "assets/images/user.png" },
                { img: res.data[4] != null ? Global.BASE_IMAGES_PATH + res.data[4].name : "assets/images/user.png" }
              ];
            }
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });


      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  getSizes() {
    this._dataService.get(Global.BASE_APT_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  getCategories() {
    this._dataService.get(Global.BASE_APT_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  getTags() {
    this._dataService.get(Global.BASE_APT_PATH + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  getColors() {
    this._dataService.get(Global.BASE_APT_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }



  onSubmit() {
    this.submitted = true;
    if ((!this.productId || this.productId === 0) && this.fileTobeUpload.length < 5) {
      this._toastr.error("Please upload 5 images per product !!");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.productForm.controls['Id'].value);
    formData.append("Name", this.productForm.controls['name'].value);
    formData.append("Title", this.productForm.controls['title'].value);
    formData.append("Code", this.productForm.controls['code'].value);
    formData.append("Price", this.productForm.controls['price'].value);
    formData.append("SalePrice", this.productForm.controls['salePrice'].value);
    formData.append("Discount", this.productForm.controls['discount'].value);
    formData.append("CategoryId", this.productForm.controls['categoryId'].value);
    formData.append("TagId", this.productForm.controls['tagId'].value);
    formData.append("SizeId", this.productForm.controls['sizeId'].value);
    formData.append("ColorId", this.productForm.controls['colorId'].value);
    formData.append("Quantity", this.productForm.controls['quantity'].value);
    formData.append("IsSale", this.productForm.controls['isSale'].value);
    formData.append("IsNew", this.productForm.controls['isNew'].value);
    formData.append("ShortDetails", this.productForm.controls['shortDetails'].value);
    formData.append("Description", this.productForm.controls['description'].value);

    // if (this.fileTobeUpload) {
    //   for (let i = 0; i < this.fileTobeUpload.length; i++) {
    //     formData.append("Image", this.fileTobeUpload[i], this.fileTobeUpload[i].name);
    //   }
    // }


    if (this.fileTobeUpload) {
      for (let i = 0; i < this.fileTobeUpload.length; i++) {
        let ToUpload = this.fileTobeUpload[i];
        formData.append("Image", ToUpload, ToUpload.name);
      }
    }


    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.postImages(Global.BASE_APT_PATH + "ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Data saved Successfully !!", 'Product Master');
            this.productForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/products/physical/product-list']);
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_APT_PATH + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Data updated Successfully !!", 'Product Master');
            this.productForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/products/physical/product-list']);
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });
    }
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.productForm.reset({
      Id: 0
    })
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objCategories = null;
    this.objColors = null;
    this.objSizes = null;
    this.objSizes = null;
  }

}
