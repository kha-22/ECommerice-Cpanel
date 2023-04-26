import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { delay, finalize } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

    return next.handle(req).pipe(
      delay(100),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
