import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { NgxSpinnerService } from "ngx-spinner";
import { Photo } from "src/app/models/Photo";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";
import { ModalService } from "src/app/services/modal.service";
import { ProductService } from "src/app/services/product.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-photo-editor",
  templateUrl: "./photo-editor.component.html",
  styleUrls: ["./photo-editor.component.css"],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[] = [];
  @Output() getPhotos = new EventEmitter<Photo[]>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  imageUrl = environment.imageUrl + "Images/Products/";
  currentMain: Photo;
  imgId: number;
  @Input() showUpload: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertivy: AlertifyService,
    private modalService: ModalService,
    private productService: ProductService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.intitiaizeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  intitiaizeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "uploader/upload/Images",
      authToken: "Bearer " + localStorage.getItem("token"),
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          isMain: res.isMain,
          productId: 0,
        };
        this.photos.push(photo);
        this.getPhotos.emit(this.photos);
        this.photos[0].isMain = true;
      }
    };
  }

  setMainPhoto(photo: Photo) {
    // this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
    //   this.currentMain = this.photos.filter(p => p.isMain === true)[0];
    //   this.currentMain.isMain = false ;
    //   photo.isMain = true;
    //   // this.getMemberPhotoChange.emit(photo.url);
    //   this.authService.changeMemberPhoto(photo.url);
    //   this.authService.currentUser.photoUrl = photo.url;
    //   localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    // }, error => {
    //   this.alertivy.error(error);
    // });
  }

  openConfirmDelete(template: TemplateRef<any>, id: number) {
    this.imgId = id;
    this.modalService.showConfirmModal(template);
  }

  close() {
    this.modalService.hideModal();
  }

  deleteImage(id: number) {
    this.spinner.show();
    this.productService.deleteProductImage(id).subscribe(
      () => {
        this.photos.splice(
          this.photos.findIndex((p) => p.id === id),
          1
        );
        this.spinner.hide();
      },
      (error) => {
        this.alertivy.error("error when delete the photo");
      }
    );
  }

  setMain(photo: Photo) {
    this.spinner.show();
    this.productService.setMain(photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.spinner.hide();
      },
      (error) => {
        this.alertivy.error("error when delete the photo");
      }
    );
  }
}
