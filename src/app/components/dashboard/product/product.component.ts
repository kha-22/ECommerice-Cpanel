import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TreeviewModule } from "ngx-treeview";
import { Photo } from "src/app/models/Photo";
import { Product } from "src/app/models/Product";
import { CommonSearchModel } from "src/app/models/searchModel";
import { CategoryService } from "src/app/services/category.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { ModalService } from "src/app/services/modal.service";
import { ProductService } from "src/app/services/product.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  commonSearchModel: CommonSearchModel = new CommonSearchModel();
  loadingProducts: boolean;
  products: any;
  config: any = {};
  imageUrl = environment.imageUrl + "Images/Products/";
  loadingPaggingData: boolean;
  loadingProductSearch: boolean;
  loadingResetProduct: boolean;
  proId: number;
  loadingDelete: boolean;
  orderDetails: any;
  productForm: FormGroup;
  buttonTitle: string;
  modalTitle: string;
  categoryList: any;
  showAddloading: boolean;
  product: Product = new Product();
  loadingProductImage: boolean;
  imgToUpload: File = null;
  productPicture: string;
  imageName: string;
  defImage: string = "../../../assets/users/NoImage.jpg";
  loadingEdit: any;
  productObject: any;
  photos: Photo[] = [];
  isAdd: boolean = true;

  constructor(
    private productService: ProductService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getProducts(1);
    this.creatwProductForm();
    this.getCategories();
  }

  uploadProductImage(file: FileList) {
    this.loadingProductImage = true;
    this.imgToUpload = file.item(0);

    this.fileUploadService.postFile(this.imgToUpload, "Images").subscribe(
      (imageResult) => {
        setTimeout(() => {
          this.imageName = imageResult;
          this.loadingProductImage = false;
          this.showImage();
        }, 50);
      },
      () => {
        setTimeout(() => {
          this.toastr.error("Error in upload image");
          this.loadingProductImage = false;
        }, 50);
      },
      () => {
        setTimeout(() => {
          //final
        }, 50);
      }
    );
  }

  updateMainPhoto(photoUrl) {
    //this.user.photoUrl = photoUrl;
  }

  showImage() {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.defImage = event.target.result;
    };
    reader.readAsDataURL(this.imgToUpload);
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.categoryList = response;
      },
      (err: any) => {
        this.toastr.error("Server response error");
      },
      () => {
        //final
      }
    );
  }

  creatwProductForm() {
    this.productForm = this.fb.group({
      id: [0],
      name: [, [Validators.required]],
      categoryId: [, [Validators.required, Validators.min(1)]],
      price: [, [Validators.required]],
      quantity: [, [Validators.required]],
      discount: [, [Validators.required]],
      description: [],
    });
  }

  onSubmit(product: any) {
    if (this.photos.length == 0) {
      this.toastr.error("Please upload image for this product");
      return;
    }

    this.showAddloading = true;
    if (product.id == 0 || product.id == null) {
      this.product.id = 0;
      this.product.name = product.name;
      this.product.categoryId = product.categoryId;
      this.product.price = product.price;
      this.product.quantity = product.quantity;
      this.product.discount = product.discount;
      this.product.description = product.description;
      this.product.productImages = this.photos;

      this.productService.addProduct(this.product).subscribe(
        () => {
          this.toastr.success("Added successfully");
          this.closeModal();
          this.getProducts(1);
          this.clearForm();
        },
        (err) => {
          this.showAddloading = false;
          this.toastr.error("Error in Add");
        },
        () => {
          this.showAddloading = false;
        }
      );
    } else {
      this.product.id = product.id;
      this.product.name = product.name;
      this.product.categoryId = product.categoryId;
      this.product.price = product.price;
      this.product.quantity = product.quantity;
      this.product.discount = product.discount;
      this.product.description = product.description;
      this.product.productImages = this.photos;

      this.productService.updateProduct(this.product).subscribe(
        () => {
          setTimeout(() => {
            this.toastr.success("Updated successfully");
            this.getProducts(1);
            this.closeModal();
            this.clearForm();
          }, 50);
        },
        (err) => {
          setTimeout(() => {
            this.showAddloading = false;
            this.toastr.error("Error in update");
          }, 50);
        },
        () => {
          this.showAddloading = false;
        }
      );
    }
  }

  setPhotos(event: any) {
    this.photos = event;
  }

  getProductForEdit(id: any, template: TemplateRef<any>) {
    this.loadingEdit = id;

    setTimeout(() => {
      this.buttonTitle = "Update";
      this.modalTitle = "Update product";

      this.productObject = this.products.find((p) => p.id == id);

      debugger;
      this.productForm.controls["id"].setValue(this.productObject.id);
      this.productForm.controls["name"].setValue(this.productObject.name);
      this.productForm.controls["categoryId"].setValue(
        this.productObject.categoryId
      );
      this.productForm.controls["price"].setValue(this.productObject.price);
      this.productForm.controls["quantity"].setValue(
        this.productObject.quantity
      );
      this.productForm.controls["discount"].setValue(
        this.productObject.discount
      );
      this.productForm.controls["description"].setValue(
        this.productObject.description
      );

      // if(this.productObject.pictureUrl == null){
      //   this.product.pictureUrl = "../../../assets/users/NoImageAr.jpg"
      // }
      // else{
      //   this.defImage = this.imageUrl + this.productObject.pictureUrl;
      // }

      this.modalService.showModalLG(template);
      this.loadingEdit = 0;
      this.photos = this.productObject.productImages;

      this.isAdd = false;
    }, 50);
  }

  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\. ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getProducts(pageNo: any) {
    this.loadingProducts = true;
    this.commonSearchModel.pageNo = pageNo;

    this.productService.getProductsPaging(this.commonSearchModel).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.products = response.data;
          this.config = {
            itemsPerPage: 5,
            currentPage: pageNo,
            totalItems: response.count,
          };
          this.loadingProducts = false;
        }, 50);
      },
      (err: any) => {
        setTimeout(() => {
          this.loadingProducts = false;
          this.toastr.error("Server response error");
        }, 50);
      },
      () => {
        //final
      }
    );
  }

  getNextProduct(pageNo) {
    this.loadingPaggingData = true;
    this.commonSearchModel.pageNo = pageNo;

    this.productService.getProductsPaging(this.commonSearchModel).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.products = response.data;
          this.config = {
            itemsPerPage: 5,
            currentPage: pageNo,
            totalItems: response.count,
          };
          this.loadingPaggingData = false;
        }, 50);
      },
      (err: any) => {
        setTimeout(() => {
          this.loadingPaggingData = false;
          this.toastr.error("Server response error");
        }, 50);
      },
      () => {
        //final
      }
    );
  }

  getProductSearch() {
    this.commonSearchModel.pageNo = 1;

    this.productService.getProductsPaging(this.commonSearchModel).subscribe(
      (response: any) => {
        this.products = response.data;
        this.config = {
          itemsPerPage: 5,
          currentPage: 1,
          totalItems: response.count,
        };
      },
      (err: any) => {
        this.toastr.error("Server response error");
      },
      () => {
        //final
      }
    );
  }

  resetProduct(pageNo: any) {
    this.loadingResetProduct = true;
    this.commonSearchModel.pageNo = pageNo;
    this.commonSearchModel.searchText = null;

    this.productService.getProductsPaging(this.commonSearchModel).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.products = response.data;
          this.config = {
            itemsPerPage: 5,
            currentPage: pageNo,
            totalItems: response.count,
          };
          this.loadingResetProduct = false;
        }, 50);
      },
      (err: any) => {
        setTimeout(() => {
          this.loadingResetProduct = false;
          this.toastr.error("Server response error");
        }, 50);
      },
      () => {
        //final
      }
    );
  }

  openConfirmDelete(template: TemplateRef<any>, id: number) {
    this.proId = id;
    this.modalService.showConfirmModal(template);
  }

  deleteProduct() {
    if (this.proId == null) {
      this.toastr.error("Error !");
      return;
    }

    this.loadingDelete = true;
    this.productService.deleteProduct(this.proId).subscribe(
      (response: any) => {
        setTimeout(() => {
          if (response == true) {
            this.toastr.success("Deleted successfully");
            this.closeModal();
            this.getProducts(1);
          } else {
            this.loadingDelete = false;
            this.toastr.error("Error in deletion");
          }
        }, 50);
      },
      (err) => {
        setTimeout(() => {
          this.loadingDelete = false;
          this.toastr.error("Error in deletion");
        }, 50);
      },
      () => {
        this.loadingDelete = false;
      }
    );
  }

  closeModal() {
    this.product = new Product();
    this.modalService.hideModal();
    this.productForm.reset();
    this.defImage = "../../../assets/users/NoImage.jpg";
    //this.resetForm();
  }

  getProductDetails(id, template: TemplateRef<any>) {
    this.orderDetails = this.products.find((p) => p.id == id);
    this.modalService.showModalLG(template);
  }

  showModal(template: TemplateRef<any>) {
    this.buttonTitle = "Save";
    this.modalTitle = "Add product";
    this.photos = [];
    this.modalService.showModalLG(template);
    this.isAdd = true;
  }

  clearForm() {
    this.productForm.reset();
    this.product = new Product();
    this.product.id = 0;
  }
}
